import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editVideo, deleteVideo } from '../actions/video'
import { slugify } from '../config/constants'

const propTypes = {
  video: PropTypes.object.isRequired,
  board: PropTypes.object,
  boards: PropTypes.object.isRequired,
  editVideo: PropTypes.func.isRequired,
  deleteVideo: PropTypes.func.isRequired,
}

class VideoEdit extends Component {
  constructor(props) {
    super(props)

    this.handleMoveClick = this.handleMoveClick.bind(this)
    this.handleTrashClick = this.handleTrashClick.bind(this)
    this.handleRecoverClick = this.handleRecoverClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleMoveClick() {
    const input = prompt(`Type a name or slug of list`)

    if (input) {
      const name = input.trim()
      const slug = slugify(name)

      if (name && slug) {
        const { video, board, editVideo } = this.props
        const newListKey = _.findKey(board.lists, ['slug', slug])
        newListKey ? editVideo(video, { list: newListKey }) : alert('Error')
      }
    }
  }

  handleTrashClick() {
    const { video, editVideo } = this.props
    editVideo({ ...video, deleted: null }, { deleted: true })
  }

  handleRecoverClick() {
    const { video, boards, editVideo } = this.props
    const input = video.board ? boards[video.board].title : prompt(`Type a name or slug of board`)

    if (input) {
      const title = input.trim()
      const slug = slugify(title)

      if (title && slug) {
        const newBoardKey = _.findKey(boards, ['slug', slug])
        newBoardKey ? editVideo(video, { board: newBoardKey, deleted: null }) : alert('Error')
      }
    }
  }

  handleDeleteClick() {
    const { video, deleteVideo } = this.props
    window.confirm(`Delete?`) && deleteVideo(video)
  }

  render() {
    const { video, boards } = this.props
    let locationString = video.board ? `to ${boards[video.board].title}` : ''
    locationString += video.list ? ` - ${boards[video.board].lists[video.list].name}` : ''

    return !video.deleted ? (
      <section style={{ opacity: video.isSyncing && '.25' }}>
        <button className="btn-link" onClick={this.handleMoveClick}>Move</button>
        &middot;
        <button className="btn-link" onClick={this.handleTrashClick}>🗑</button>
      </section>
    ) : (
      <section>
        <button className="btn-link" onClick={this.handleRecoverClick}>Recover {locationString}</button>
        &middot;
        <button className="btn-link" onClick={this.handleDeleteClick}>Delete</button>
      </section>
    )
  }
}

VideoEdit.propTypes = propTypes

function mapStateToProps({ boards }) {
  return { boards }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editVideo, deleteVideo }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoEdit)
