import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as firebase from 'firebase'
import './AppHeader.css'

class AppNav extends React.Component {
  render() {
    if (!this.props.authenticated) {
      return (
        <nav className="AppNav">
          <Link to="/signup">Sign up</Link>
          <Link to="/signin">Sign in</Link>
        </nav>
      )
    } else {
      const user = firebase.auth().currentUser

      return (
        <nav className="AppNav">
          {user && <span>{user.email}</span>}
          <Link to="/signout">Sign out</Link>
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
          <Link to="/">Video Archives <small>alpha</small></Link>
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
