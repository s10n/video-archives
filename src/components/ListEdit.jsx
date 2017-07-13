import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editList, deleteList } from '../actions/list'
import { errorMessages, slugify } from '../config/constants'
import './ListEdit.css'

const propTypes = {
  board: PropTypes.object.isRequired,
  list: PropTypes.object,
  videos: PropTypes.array.isRequired,
  editList: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired
}

class ListEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isEditing: false, name: '', slug: '', error: null }

    this.handleNameClick = this.handleNameClick.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePressEnter = this.handlePressEnter.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleNameClick() {
    const { name, slug } = this.props.list
    this.setState({ isEditing: true, name, slug })
  }

  handleInputBlur() {
    const { name, slug } = this.props.list
    this.setState({ isEditing: false, name, slug, error: null })
  }

  handleInputChange(name) {
    const { board, list } = this.props
    const slug = slugify(name)
    const isListExists = _.findKey(board.lists, l => slug === l.slug && slug !== list.slug)
    const error = isListExists && errorMessages.list.exists

    this.setState({ name, slug, error })
  }

  handlePressEnter() {
    const name = this.state.name.trim()
    const { slug, error } = this.state

    if (name && slug && !error) {
      const { board, list, editList } = this.props
      editList(board.key, list, { name, slug })
      this.listNameInput.blur()
    }
  }

  handleDeleteClick() {
    const { board, list, videos, deleteList } = this.props

    if (window.confirm(`Delete ${list.name}?\nAll videos will be deleted.`)) {
      deleteList(board, list, videos)
    }
  }

  render() {
    const { list } = this.props
    const { isEditing, name, error } = this.state

    return !_.isEmpty(list) ? (
      <div>
        <input
          className="ListName borderless-input"
          type="text"
          onFocus={this.handleNameClick}
          onBlur={this.handleInputBlur}
          onChange={event => this.handleInputChange(event.target.value)}
          onKeyPress={event => (event.key === 'Enter') && this.handlePressEnter()}
          value={!isEditing ? list.name : name}
          ref={input => this.listNameInput = input}
        />

        <button className="BtnTrash btn-link" onClick={this.handleDeleteClick}>🗑</button>

        {error && <small className="HelpBlock">{error}</small>}
      </div>
    ) : <span role="img" aria-label="Inbox">📥</span>
  }
}

ListEdit.propTypes = propTypes

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editList, deleteList }, dispatch)
}

export default connect(null, mapDispatchToProps)(ListEdit)
