import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { errorMessages, reservedBoardSlug } from '../constants/app'
import { slugify } from '../constants/utils'
import './BoardEdit.css'

const propTypes = {
  boards: PropTypes.object.isRequired,
  board: PropTypes.object.isRequired,
  videos: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

class BoardEdit extends Component {
  constructor(props) {
    super(props)

    this.state = { isEditing: false, title: '', slug: '', error: null }

    this.handleTitleClick = this.handleTitleClick.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePressEnter = this.handlePressEnter.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleTitleClick() {
    const { title, slug } = this.props.board
    this.setState({ isEditing: true, title, slug })
  }

  handleInputBlur() {
    const { title, slug } = this.props.board
    this.setState({ isEditing: false, title, slug, error: null })
  }

  handleInputChange(title) {
    const { boards, board } = this.props
    const slug = slugify(title)
    const isBoardExists = _.find(boards, b => slug === b.slug && slug !== board.slug)
    const isSlugReserved = reservedBoardSlug.includes(slug)

    let error = null
    if (isBoardExists) error = errorMessages.board.exists
    if (isSlugReserved) error = errorMessages.board.reserved

    this.setState({ title, slug, error })
  }

  handlePressEnter() {
    const title = this.state.title.trim()
    const { slug, error } = this.state

    if (title && slug && !error) {
      const { board, onEdit } = this.props
      onEdit(board, { title, slug })
      this.boardTitleInput.blur()
    }
  }

  handleDeleteClick() {
    const { board, videos, onDelete } = this.props

    if (window.confirm(`Delete ${board.title}?\nAll lists and videos will be deleted.`)) {
      onDelete(board, videos)
    }
  }

  render() {
    const { board } = this.props
    const { isEditing, title, error } = this.state

    return (
      <div className="BoardEdit">
        <input
          className="BoardTitle h1 borderless-input"
          type="text"
          onFocus={!board.isSyncing && this.handleTitleClick}
          onBlur={this.handleInputBlur}
          onChange={event => this.handleInputChange(event.target.value)}
          onKeyPress={event => event.key === 'Enter' && this.handlePressEnter()}
          value={!isEditing ? board.title : title}
          ref={input => (this.boardTitleInput = input)}
        />

        <button className="BtnTrash btn-link" onClick={this.handleDeleteClick}>
          🗑
        </button>

        {error && <small>{error}</small>}
      </div>
    )
  }
}

BoardEdit.propTypes = propTypes

export default BoardEdit
