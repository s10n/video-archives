import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PageFront from './components/PageFront'
import PageSignup from './components/PageSignup'
import PageSignin from './components/PageSignin'
import PageSignout from './components/PageSignout'
import Trash from './components/Trash'
import Board from './components/Board'

export default (
  <Switch>
    <Route exact path="/" component={PageFront} />
    <Route exact path="/signup" component={PageSignup} />
    <Route exact path="/signin" component={PageSignin} />
    <Route exact path="/signout" component={PageSignout} />
    <Route exact path="/trash" component={Trash} />
    <Route exact path="/:boardSlug" component={Board} />
  </Switch>
)
