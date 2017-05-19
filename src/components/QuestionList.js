import React from 'react'
import PropTypes from 'prop-types'
import Question from './Question'
import { graphql } from 'react-apollo'

import update from 'immutability-helper'
import { isDuplicate, POLLING_TIME } from '../utils/helpers'
import Loading from './Loading'

import QUESTIONS_QUERY from '../graphql/Questions.query.gql'
import QUESTIONS_SUBSCRIPTION from '../graphql/Questions.subscription.gql'

class QuestionList extends React.Component {

  componentWillMount() {
    this.props.subscribeToNewQuestions()
  }

  refetch() {
    this.props.data.refetch()
  }

  isEmpty() {
    return (!this.props.loading && (!this.props.questions ||
      this.props.questions && (this.props.questions.length===0) || (this.props.questions.filter(q => q.flagged).length===this.props.questions.length && !this.props.auth.role)))
  }

  refresh() {
    if (!this.isEmpty() && !this.props.loading) {
      return (
        <ul>
          <li>
            <div className='centerBlock'>
              <button className='btn btn-primary' onClick={() => this.refetch()}>Refresh</button>
            </div>
          </li>
        </ul>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <div className='list'>
        <ul>
          { this.props.questions && this.props.questions.map((q, i) =>
            <Question
              key={i}
              question={q}
              auth={this.props.auth}
            />
          ).sort((a, b) => {
            if ((this.props.auth.role==='User' || !this.props.auth.role)) return 0

            return (b.props.question._votesMeta.count - a.props.question._votesMeta.count)
          })
        }
        </ul>
        {this.refresh()}
        {this.isEmpty()? <div className='centered text-body'>There are no questions.</div> : null }
        {this.props.loading ? <Loading /> : null}
        <section id='bottom' />
      </div>
    )
  }
}

const withQuestions = graphql(QUESTIONS_QUERY,
  {
    options: { pollInterval: POLLING_TIME },
    props: ({ data }) => {
      if (data.loading) return { loading: true }
      if (data.error) return { hasErrors: true }
      return {
        questions: data.allQuestions,
        data,
      }
    },
  },
)

const withSubscription = graphql(QUESTIONS_QUERY,
  {
    props: ({ data: { subscribeToMore } }) => ({
      subscribeToNewQuestions() {
        return subscribeToMore({
          document: QUESTIONS_SUBSCRIPTION,
          updateQuery: (state, { subscriptionData }) => {
            const newQuestion = subscriptionData.data.Question.node
            if (!isDuplicate(newQuestion.id, state.allQuestions)) {
              return update(state, {
                allQuestions: {
                  $push: [newQuestion],
                },
              })
            }
          },
        })
      },
    }),
  },
)

QuestionList.propTypes = {
  auth: PropTypes.object.isRequired,
}

export default withSubscription(withQuestions(QuestionList))
