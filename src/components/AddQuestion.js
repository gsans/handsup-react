import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'
import { addToLocalCache, isDuplicate, ALERT_DEFAULT } from '../utils/helpers'
require('smoothscroll-polyfill').polyfill()
import Alert from 'react-s-alert'

import CREATE_QUESTION_MUTATION from '../graphql/CreateQuestion.mutation.gql'
const MAX_CHAR = 140

class AddQuestion extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      chars_left: MAX_CHAR,
    }
  }

  onSubmit(event) {
    event.preventDefault()
    if (!this.input.value || this.input.value.length === 0) {
      return
    }
    if (scrollTo) {
      // let elem = document.getElementById('app')
      // elem.scrollTop = elem.scrollHeight
      let elem = document.querySelector('#bottom')
      elem.scrollIntoView({ behavior: 'smooth' })
    }
    this.props
      .addQuestion(this.input.value, this.props.auth.userId)
      .then(() => {
        Alert.success('New question Added', ALERT_DEFAULT)
        this.input.value = ''
        this.setState({
          chars_left: MAX_CHAR,
        })
      })
  }

  handleChange(event) {
    let input = event.target.value
    input = input.substring(0, MAX_CHAR)
    this.button.disabled = (input.length === 0)
    if (input.length === MAX_CHAR) {
      this.input.value = input
    }
    this.setState({
      chars_left: MAX_CHAR - input.length,
    })
  }

  render() {
    return (
      <div className='bottom_wrapper clearfix'>
        <div className='message_input_wrapper'>
          <form onSubmit={e => this.onSubmit(e)}>
            <input
              className='message_input'
              placeholder='Type your question here...'
              ref={node => (this.input = node)}
              onChange={e => this.handleChange(e)}
            />
            <div className='counter'>{this.state.chars_left}/{MAX_CHAR}</div>
            <button className='send_message' type='submit' ref={(button) => (this.button= button)} disabled>Send</button>
          </form>
        </div>
      </div>
    )
  }
}

const withAddQuestion = graphql(CREATE_QUESTION_MUTATION,
  {
    props: ({ mutate }) => ({
      addQuestion(body, id) {
        return mutate({
          variables: { body: body, user: id },
          updateQueries: {
            questions: (state, { mutationResult }) => {
              let newQuestion = mutationResult.data.createQuestion
              if (!isDuplicate(newQuestion)) {
                addToLocalCache(newQuestion)
                return update(state, {
                  allQuestions: {
                    $push: [mutationResult.data.createQuestion],
                  },
                })
              }
            },
          },
        })
      },
    }),
  },
)

AddQuestion.propTypes = {
  auth: PropTypes.object.isRequired,
}

export default withAddQuestion(AddQuestion)
