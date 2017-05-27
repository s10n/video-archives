import React from 'react'
import { Switch, Route } from 'react-router-dom'
import './AppMain.css'
import PageFront from './PageFront'
import PageTrash from './PageTrash'
import BoardRead from './BoardRead'
import PageSignup from './auth/PageSignup'
import PageSignin from './auth/PageSignin'
import PageSignout from './auth/PageSignout'

const AppMain = () => {
  return (
    <main className="AppMain">
      <div className="PageWrapper">
        <Switch>
          <Route exact path="/" component={PageFront} />
          <Route exact path="/trash" component={PageTrash} />
          <Route exact path="/signup" component={PageSignup} />
          <Route exact path="/signin" component={PageSignin} />
          <Route exact path="/signout" component={PageSignout} />
          <Route path="/:boardSlug" component={BoardRead} />
        </Switch>
      </div>
    </main>
  )
}

export default AppMain
