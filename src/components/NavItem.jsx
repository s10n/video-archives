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
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired
}

const boardTarget = {
  canDrop(props, monitor) {
    const { board } = props
    const { list } = monitor.getItem()
    return !(list && board)
  },

  drop(props) {
    return !props.trash ? { board: props.board } : { trash: true }
  }
}

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

const NavItem = ({ board, count, trash, connectDropTarget, isOver, canDrop }) => {
  return connectDropTarget(
    <div className={(isOver && canDrop) ? 'NavItem canDrop' : 'NavItem'}>
      {!trash ? <span>{board.title}</span> : <span>Trash</span>}
      <span className="count">{count}</span>
    </div>
  )
}

NavItem.propTypes = propTypes

export default DropTarget([ItemTypes.VIDEO, ItemTypes.LIST], boardTarget, collect)(NavItem)
