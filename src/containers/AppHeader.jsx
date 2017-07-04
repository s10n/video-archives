import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import * as firebase from 'firebase'
import { appConfig } from '../config/config'
import './AppHeader.css'

const AppNav = ({ status, authenticated }) => {
  if (!authenticated) {
    return appConfig.signupAllowed && (
      <nav className="AppNav">
        <NavLink activeClassName="active" to="/signup">Sign up</NavLink>
        <NavLink activeClassName="active" to="/signin">Sign in</NavLink>
      </nav>
    )
  } else {
    const user = firebase.auth().currentUser

    return (
      <nav className="AppNav">
        {status && <span>{status}</span>}
        {user && <span>{user.email}</span>}
        <NavLink activeClassName="active" to="/signout">Sign out</NavLink>
      </nav>
    )
  }
}

const AppHeader = ({ status, authenticated }) => {
  return (
    <header className="AppHeader">
      <h1 className="AppTitle">
        <NavLink activeClassName="active" to="/">Video Archives <small>alpha</small></NavLink>
      </h1>

      <AppNav status={status} authenticated={authenticated} />
    </header>
  )
}

function mapStateToProps(state) {
  const { status } = state.app
  return { status, authenticated: state.auth.authenticated }
}

export default connect(mapStateToProps)(AppHeader)
