import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import * as firebase from 'firebase'
import { appConfig } from '../config/config'
import './AppHeader.css'

const propTypes = {
  status: PropTypes.string,
  authenticated: PropTypes.bool.isRequired
}

const defaultProps = {
  status: ''
}

const AppHeader = ({ status, authenticated }) => {
  const AppNavNotAuthenticated = () => {
    return appConfig.signupAllowed
      ? <nav className="AppNav">
          <NavLink to="/signup" className="hidden-mobile">
            Sign up
          </NavLink>

          <NavLink to="/signin">Sign in</NavLink>
        </nav>
      : null
  }

  const AppNavAuthenticated = () => {
    const user = firebase.auth().currentUser

    return (
      <nav className="AppNav">
        {status &&
          <span className="hidden-mobile">
            {status}
          </span>}

        {user &&
          <span className="hidden-mobile">
            {user.email}
          </span>}

        <NavLink to="/signout">Sign out</NavLink>
      </nav>
    )
  }

  return (
    <header className="AppHeader">
      <h1 className="AppTitle">
        <NavLink to="/">
          Video Archives <small className="hidden-mobile">alpha</small>
        </NavLink>
      </h1>

      {authenticated ? <AppNavAuthenticated /> : <AppNavNotAuthenticated />}
    </header>
  )
}

AppHeader.propTypes = propTypes
AppHeader.defaultProps = defaultProps

function mapStateToProps({ app, auth }) {
  return { status: app.status, authenticated: auth.authenticated }
}

export default connect(mapStateToProps)(AppHeader)
