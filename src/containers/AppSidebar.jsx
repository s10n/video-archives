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

const AppSidebar = ({ boards, trash }) => {
  const boardsSorted = _.sortBy(boards, 'title')

  return (
    <nav className="AppSidebar">
      {boardsSorted.map(board =>
        <NavLink activeClassName="active" to={'/' + board.slug} key={board.key}>
          {board.title}
        </NavLink>
      )}

      {trash &&
        <NavLink activeClassName="active" to="/trash">
          Trash
        </NavLink>
      }

      <BoardAdd boards={boards} />
    </nav>
  )
}

AppSidebar.propTypes = propTypes

export default AppSidebar
