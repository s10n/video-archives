import React from 'react'
import PropTypes from 'prop-types'
import './NavItem.css'

const propTypes = {
  board: PropTypes.object,
  count: PropTypes.number,
  trash: PropTypes.bool
}

const NavItem = ({ board, count, trash }) => {
  return (
    <div className="NavItem">
      {!trash ? <span>{board.title}</span> : <span>Trash</span>}
      <span className="count">{count}</span>
    </div>
  )
}

NavItem.propTypes = propTypes

export default NavItem
