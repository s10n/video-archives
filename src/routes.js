import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import FrontPage from './containers/FrontPage'
import BoardRead from './containers/BoardRead'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={FrontPage} />
    <Route path=":boardName" component={BoardRead} />
  </Route>
)
