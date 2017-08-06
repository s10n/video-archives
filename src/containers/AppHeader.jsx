import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { auth } from '../constants/api'
import appConfig from '../config/app'
import './AppHeader.css'

const propTypes = {
  status: PropTypes.string,
  authenticated: PropTypes.bool.isRequired
}

const defaultProps = {
  status: ''
}

const AppHeader = ({ status, authenticated }) => {
  const appNav = authenticated => {
    if (!authenticated) {
      return appConfig.signupAllowed
        ? <nav className="AppNav">
            <NavLink to="/signup" className="hidden-mobile">
              Sign up
            </NavLink>

            <NavLink to="/signin">Sign in</NavLink>
          </nav>
        : null
    }

    const user = auth().currentUser

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

      {appNav(authenticated)}
    </header>
  )
}

AppHeader.propTypes = propTypes
AppHeader.defaultProps = defaultProps

export default AppHeader
