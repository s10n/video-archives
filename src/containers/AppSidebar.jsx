import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { NavLink } from 'react-router-dom'
import { addBoard } from '../actions/board'
import './AppSidebar.css'
import NavItem from '../components/NavItem'
import BoardAdd from '../components/BoardAdd'

const propTypes = {
  boards: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
  trash: PropTypes.number.isRequired,
  addBoard: PropTypes.func.isRequired
}

const AppSidebar = ({ boards, videos, trash, addBoard }) => {
  const boardsSorted = _.sortBy(boards, 'title')

  return (
    <nav className="AppSidebar">
      <div className="AppSidebarInner">
        {boardsSorted.map(board => {
          const count = _.filter(videos, v => v.board === board.key && !v.deleted).length
          return (
            <NavLink to={'/' + board.slug} key={board.key}>
              <NavItem board={board} count={count} />
            </NavLink>
          )
        })}

        {trash > 0 &&
          <NavLink to="/trash">
            <NavItem trash count={trash} />
          </NavLink>}

        <BoardAdd boards={boards} onAdd={addBoard} />
      </div>
    </nav>
  )
}

AppSidebar.propTypes = propTypes

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ addBoard }, dispatch)
}

export default connect(null, mapDispatchToProps)(AppSidebar)
