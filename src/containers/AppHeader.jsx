import React from 'react'
import { Link } from 'react-router'
import './AppHeader.css'

const AppHeader = () => {
  return (
    <header className="AppHeader">
      <h1 className="AppTitle">
        <Link to="/">Video Archives <small>alpha</small></Link>
      </h1>

      {true ?
        <nav className="AppNav">
          <Link to="/signup">Sign up</Link>
          <Link to="/signin">Sign in</Link>
        </nav>
      :
        <nav className="AppNav">
          <Link to="/signout">Sign out</Link>
        </nav>
      }
    </header>
  )
}

export default AppHeader
