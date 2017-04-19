import React from 'react'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'
import { withRouter } from 'react-router-dom'

import TopNavigation from './TopNavigation'
import AddQuestion from './AddQuestion'
import QuestionList from './QuestionList'

import USER_QUERY from '../graphql/User.query.gql'
import CREATE_USER_MUTATION from '../graphql/CreateUser.mutation.gql'

import QUESTIONS_QUERY from '../graphql/Questions.query.gql'
import QUESTIONS_SUBSCRIPTION from '../graphql/Questions.subscription.gql'

import { isDuplicate, setUserDetails } from '../utils/helpers'

class HandsUpAppBase extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLogged: false,
    }
  }

  componentWillMount() {
    if (this.props.auth.profile) {
      this.updateState({ isLogged: true })
    }
    this.props.subscribeToNewQuestions()
  }

  updateState(state) {
    this.setState(state)
    if (this.props.auth.profile) {
      const variables = setUserDetails(this.props.auth)
      this.props.createUser({ variables }).catch(e => {
        if (e.graphQLErrors) {
          e.graphQLErrors.forEach(error => {
            switch (error.code) {
              case 3023:
                break // existing user
              default:
                console.error(error)
            }
          }, this)
        }
      })
    }
  }

  render() {
    let addQuestion = null
    if (this.state.isLogged) {
      addQuestion = (
        <AddQuestion auth={this.props.auth} />
      )
    }

    return (
      <div className='app'>
        <TopNavigation auth={this.props.auth} isLogged={this.state.isLogged} />
        {addQuestion}
        <QuestionList
          questions={this.props.questions || []}
        />
        <div className='flying-hearts' />
      </div>
    )
  }
}
const HandsUpApp = withRouter(HandsUpAppBase)

const withUser = graphql(USER_QUERY, {
  options: {
    fetchPolicy: 'network-only',
  },
  props: ({ ownProps, data }) => {
    // User logged using Auth0. This is graphcool userId
    // Eg: required to add questions and voting
    // We store it in the Authorisation class
    if (data.user && data.user.id) {
      ownProps.auth.userId = data.user.id
    }
    if (data.user && data.user.role) {
      ownProps.auth.role = data.user.role
    }
    return {
      user: data.user,
    }
  },
})

const withCreateUser = graphql(CREATE_USER_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    createUser({ variables }) {
      return mutate({
        variables: {
          idToken: variables.idToken,
          name: variables.name,
          username: variables.username,
          pictureUrl: variables.profileUrl,
          role: variables.role,
        },
        updateQueries: {
          questions: (state, { mutationResult }) => {
            ownProps.auth.userId = mutationResult.data.createUser.id
            return state
          },
        },
      })
    },
  }),
})

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

export default withSubscription(
  withCreateUser(
    withUser(withQuestions(HandsUpApp)),
  ),
)
