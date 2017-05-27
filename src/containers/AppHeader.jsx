import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import * as firebase from 'firebase'
import './AppHeader.css'

class AppNav extends React.Component {
  render() {
    if (!this.props.authenticated) {
      return (
        <nav className="AppNav">
          <NavLink activeClassName="active" to="/signup">Sign up</NavLink>
          <NavLink activeClassName="active" to="/signin">Sign in</NavLink>
        </nav>
      )
    } else {
      const user = firebase.auth().currentUser

      return (
        <nav className="AppNav">
          {user && <span>{user.email}</span>}
          <NavLink activeClassName="active" to="/signout">Sign out</NavLink>
        </nav>
      )
    }
  }
}

class AppHeader extends React.Component {
  render() {
    return (
      <header className="AppHeader">
        <h1 className="AppTitle">
          <NavLink activeClassName="active" to="/">Video Archives <small>alpha</small></NavLink>
        </h1>

        <AppNav authenticated={this.props.authenticated} />
      </header>
    )
  }
}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated }
}

export default connect(mapStateToProps)(AppHeader)
