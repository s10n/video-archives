import React from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import { ItemTypes } from '../config/constants'
import './NavItem.css'

const propTypes = {
  board: PropTypes.object,
  count: PropTypes.number,
  trash: PropTypes.bool,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired
}

const boardTarget = {
  drop(props) {
    return !props.trash ? { board: props.board } : { trash: true }
  }
}

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

const NavItem = ({ board, count, trash, connectDropTarget, isOver }) => {
  return connectDropTarget(
    <div className={isOver ? 'NavItem canDrop' : 'NavItem'}>
      {!trash ? <span>{board.title}</span> : <span>Trash</span>}
      <span className="count">{count}</span>
    </div>
  )
}

NavItem.propTypes = propTypes

export default DropTarget(ItemTypes.VIDEO, boardTarget, collect)(NavItem)
