import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import './AppSidebar.css'
import BoardAdd from '../components/BoardAdd'

const propTypes = {
  boards: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
  trash: PropTypes.number.isRequired
}

const AppSidebar = ({ boards, videos, trash }) => {
  const boardsSorted = _.sortBy(boards, 'title')

  return (
    <nav className="AppSidebar">
      {boardsSorted.map(board => {
        const count = _.filter(videos, video => video.board === board.key && !video.deleted).length

        return (
          <NavLink activeClassName="active" to={'/' + board.slug} key={board.key}>
            <span>{board.title}</span>
            <span className="count">{count}</span>
          </NavLink>
        )
      })}

      {(trash > 0) &&
        <NavLink activeClassName="active" to="/trash">
          <span>Trash</span>
          <span className="count">{trash}</span>
        </NavLink>
      }

      <BoardAdd boards={boards} />
    </nav>
  )
}

AppSidebar.propTypes = propTypes

export default AppSidebar
