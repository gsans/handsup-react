import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import Alert from 'react-s-alert'
import update from 'immutability-helper'

import { ALERT_DEFAULT } from '../utils/helpers'
import FLAG_QUESTION_MUTATION from '../graphql/FlagQuestion.mutation.gql'
import FLAG_USER_MUTATION from '../graphql/FlagUser.mutation.gql'

class ModeratorOptions extends React.Component {
  flagUser(question) {
    if (question.flagged) {
      this.props.flagUser(question.user.id, question.user.flagged)
    } else {
      this.props.flagQuestion(question.id, question.flagged).then(() => {
        this.props.flagUser(question.user.id, question.user.flagged)
      })
    }
  }

  flagQuestion(question) {
    this.props.flagQuestion(question.id, question.flagged)
  }

  render() {
    if (this.props.role && this.props.role !== 'User') {
      return (
        <div>
          <button
            className='btn btn-primary'
            onClick={() => this.flagUser(this.props.question)}
            disabled={!this.props.question.user}
            title='Block User'>
            <i className='fa fa-user-times' />
          </button>
          <button
            className='btn btn-primary'
            onClick={() => this.flagQuestion(this.props.question)}
            title='Block Question'>
            <i className='fa fa-eye-slash' />
          </button>
        </div>
      )
    } else {
      return null
    }
  }
}

const withFlagQuestion = graphql(FLAG_QUESTION_MUTATION, {
  props: ({ mutate }) => ({
    flagQuestion(id, flagged) {
      return mutate({
        variables: { question: id, flagged: !flagged },
        updateQueries: {
          questions: (state, { mutationResult }) => {
            let newQuestion = mutationResult.data.updateQuestion
            let newArray = state.allQuestions.map(q => {
              if (q.id === id) {
                return newQuestion
              }
              return q
            })
            return update(state, {
              questions: { $set: newArray },
            })
          },
        },
      }).catch(error => {
        Alert.error(error.message, ALERT_DEFAULT)
      })
    },
  }),
})

const withFlagUser = graphql(FLAG_USER_MUTATION, {
  props: ({ mutate }) => ({
    flagUser(id, flagged) {
      return mutate({
        variables: { user: id, flagged: !flagged },
        updateQueries: {
          questions: (state, { mutationResult }) => {
            return state
          },
        },
      }).catch(error => {
        Alert.error(error.message, ALERT_DEFAULT)
      })
    },
  }),
})

ModeratorOptions.propTypes = {
  question: PropTypes.object.isRequired,
}

export default withFlagUser(withFlagQuestion(ModeratorOptions))
