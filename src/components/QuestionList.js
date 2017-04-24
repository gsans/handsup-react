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

  render() {
    return (
      <div className='list'>
        <ul>
          { this.props.questions && this.props.questions.map(question =>
            <Question
              key={question.id}
              question={question}
              auth={this.props.auth}
            />
          )}
        </ul>
        {(!this.props.loading && this.props.questions && this.props.questions.length===0)? <div className='centered text-body'>No questions yet. Add one!</div> : null }
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
            if (!isDuplicate(newQuestion.id)) {
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
