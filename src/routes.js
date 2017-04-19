import React from 'react'
import { Route, IndexRoute } from 'react-router'

import TodoApp from './components/TodoApp'

export default (
  <Route
    path="/"
    component={TodoApp}
  >
    <IndexRoute
      component={TodoApp}
    />
  </Route>
);