import React from 'react'
import Question from './Question'
import { graphql } from 'react-apollo'

import update from 'immutability-helper'
import { isDuplicate } from '../utils/helpers'

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
            />
          )}
        </ul>
      </div>
    )
  }
}

const withQuestions = graphql(QUESTIONS_QUERY,
  {
    options: { pollInterval: 20000 },
    props: ({ ownProps, data }) => {
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
    props: ({ ownProps, data: { subscribeToMore } }) => ({
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

export default withSubscription(withQuestions(QuestionList))
