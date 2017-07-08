import _ from 'lodash'
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
      {_.sortBy(boards, 'title').map(board =>
        <NavLink activeClassName="active" to={'/' + board.slug} key={board.key}>
          {board.title}
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
