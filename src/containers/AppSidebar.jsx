import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import './AppSidebar.css'
import BoardAdd from '../components/BoardAdd'

const propTypes = {
  boards: PropTypes.object.isRequired,
  trash: PropTypes.bool.isRequired
}

const defaultProps = {
  boards: {},
  trash: false
}

const AppSidebar = ({ boards, trash }) => {
  return (
    <nav className="AppSidebar">
      {Object.keys(boards).map(key =>
        <NavLink activeClassName="active" to={'/' + boards[key].slug} key={key}>
          {boards[key].title}
        </NavLink>
      )}

      {trash &&
        <NavLink activeClassName="active" to="/trash">
          Trash
        </NavLink>
      }

      <BoardAdd />
    </nav>
  )
}

AppSidebar.propTypes = propTypes
AppSidebar.defaultProps = defaultProps

export default AppSidebar
