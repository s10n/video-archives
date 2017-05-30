import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PageFront from './containers/PageFront'
import PageTrash from './containers/PageTrash'
import BoardRead from './containers/BoardRead'
import PageSignup from './containers/auth/PageSignup'
import PageSignin from './containers/auth/PageSignin'
import PageSignout from './containers/auth/PageSignout'

export default (
  <Switch>
    <Route exact path="/" component={PageFront} />
    <Route exact path="/trash" component={PageTrash} />
    <Route exact path="/signup" component={PageSignup} />
    <Route exact path="/signin" component={PageSignin} />
    <Route exact path="/signout" component={PageSignout} />
    <Route path="/:boardSlug" component={BoardRead} />
  </Switch>
)
