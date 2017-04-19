import React from 'react'
import { render } from 'react-dom'
import HandsUpApp from './components/HandsUpApp'

import { ApolloProvider } from 'react-apollo'
import { client } from './client'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { HashRouter, Route } from 'react-router-dom'

import Authorisation from './components/Authorisation'
const auth = new Authorisation()

import './style.css'

function filter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_FILTER') {
    return action.filter
  }
  return state
}

const combinedReducer = combineReducers({
  filter,
  apollo: client.reducer(),
})

const store = compose(
  applyMiddleware(
    client.middleware(),
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(combinedReducer)

class HandsUpAppWrapper extends React.Component {
  render() {
    return (
      <HandsUpApp auth={auth} {...this.props} />
    )
  }
}

render(
  <ApolloProvider store={store} client={client}>
    <HashRouter>
      <Route path='/' component={HandsUpAppWrapper} />
    </HashRouter>
  </ApolloProvider>,
  document.getElementById('root')
)
