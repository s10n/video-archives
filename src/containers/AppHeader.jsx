import React from 'react'
import { Link } from 'react-router'
import './AppHeader.css'

const AppHeader = () => {
  return (
    <header className="AppHeader">
      <h1 className="AppTitle">
        <Link to="/">Video Archives <small>alpha</small></Link>
      </h1>
    </header>
  )
}

export default AppHeader
