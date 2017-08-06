import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { slugify } from '../constants/utils'

const propTypes = {
  video: PropTypes.object.isRequired,
  board: PropTypes.object,
  boards: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

const defaultProps = {
  board: {}
}

class VideoEdit extends Component {
  constructor(props) {
    super(props)

    this.handleTrashClick = this.handleTrashClick.bind(this)
    this.handleRecoverClick = this.handleRecoverClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleTrashClick() {
    const { video, onEdit } = this.props
    onEdit({ ...video, deleted: null }, { deleted: true })
  }

  handleRecoverClick() {
    const { video, boards, onEdit } = this.props
    const input = video.board ? boards[video.board].title : prompt(`Type a name or slug of board`)

    if (input) {
      const title = input.trim()
      const slug = slugify(title)

      if (title && slug) {
        const newBoardKey = _.findKey(boards, ['slug', slug])
        newBoardKey ? onEdit(video, { board: newBoardKey, deleted: null }) : alert('Error')
      }
    }
  }

  handleDeleteClick() {
    const { video, onDelete } = this.props
    window.confirm(`Delete?`) && onDelete(video)
  }

  render() {
    const { video, boards } = this.props
    const opacity = video.isSyncing && '.25'
    let locationString = video.board ? `to ${boards[video.board].title}` : ''
    locationString += video.list ? ` - ${boards[video.board].lists[video.list].name}` : ''

    return !video.deleted
      ? <span className="VideoEdit" style={{ opacity }}>
          <button className="btn-link" onClick={this.handleTrashClick}>
            🗑
          </button>
        </span>
      : <section className="VideoEdit" style={{ opacity }}>
          <button className="btn-link" onClick={this.handleRecoverClick}>
            Recover {locationString}
          </button>
          &middot;
          <button className="btn-link" onClick={this.handleDeleteClick}>
            Delete
          </button>
        </section>
  }
}

VideoEdit.propTypes = propTypes
VideoEdit.defaultProps = defaultProps

export default VideoEdit
