import React from 'react'
import Question from './Question'
import { graphql } from 'react-apollo'

import update from 'immutability-helper'
import { isDuplicate, POLLING_TIME } from '../utils/helpers'

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
  auth: React.PropTypes.object.isRequired,
}

export default withSubscription(withQuestions(QuestionList))
