import React from 'react'
import { render } from 'react-dom'
import HandsUpApp from './components/HandsUpApp'

import { ApolloProvider } from 'react-apollo'
import { client } from './client'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { HashRouter, Route } from 'react-router-dom'
import Authorisation from './services/Authorisation'
import './style.css'

const combinedReducer = combineReducers({
  apollo: client.reducer(),
})

const store = compose(
  applyMiddleware(
    client.middleware(),
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(combinedReducer)

const auth = new Authorisation()

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
