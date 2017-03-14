import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editVideo, deleteVideo, addBoard, addList } from '../actions'
import './VideoItem.css'

const propTypes = {
  video: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  addingVideo: React.PropTypes.bool,
  editVideo: React.PropTypes.func.isRequired,
  deleteVideo: React.PropTypes.func.isRequired,
  addBoard: React.PropTypes.func.isRequired,
  addList: React.PropTypes.func.isRequired
}

const defaultProps = {
  video: {},
  boards: [],
  addingVideo: false,
  editVideo: () => console.warn('editVideo not defined'),
  deleteVideo: () => console.warn('deleteVideo not defined'),
  addBoard: () => console.warn('addBoard not defined'),
  addList: () => console.warn('addList not defined')
}

class VideoItem extends React.Component {
  constructor(props) {
    super(props)
    this.onMoveClick = this.onMoveClick.bind(this)
    this.onTrashClick = this.onTrashClick.bind(this)
    this.onRecoverClick = this.onRecoverClick.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  onMoveClick() {
    const name = prompt(`Type a name or slug of list`).trim()
    const slug = name.trim().toString().toLowerCase().replace(/\s+/g, '-')

    if (name && slug) {
      const board = _.find(this.props.boards, ['slug', this.props.video.board])
      const listExists = _.find(board.lists, ['slug', slug])
      const list = { name, slug }
      listExists || this.props.addList(list, board)
      this.props.editVideo(this.props.video, { list: slug })
    }
  }

  onTrashClick() {
    this.props.editVideo(this.props.video, { deleted: true })
  }

  onRecoverClick() {
    const title = this.props.video.board || prompt(`Type a name or slug of board`).trim()
    const slug = title.trim().toString().toLowerCase().replace(/\s+/g, '-')

    if (title && slug) {
      const boardExists = _.find(this.props.boards, ['slug', slug])
      const board = { title, slug }
      boardExists || this.props.addBoard(board)
      this.props.editVideo(this.props.video, { board: slug, deleted: false })
    }
  }

  onDeleteClick() {
    this.props.deleteVideo(this.props.video)
  }

  render() {
    const video = this.props.video
    const url = `https://www.youtube.com/watch?v=${video.data.id}`
    const publishedAt = new Date(video.data.snippet.publishedAt)

    // TODO: Change thumbnail ratio to 16:9
    return (
      <article className="VideoItem">
        <img src={video.data.snippet.thumbnails.high.url} role="presentation" height="120" />

        <h3 className="VideoTitle">
          <a href={url} target="_blank">{video.data.snippet.title}</a>
        </h3>

        <section className="VideoMeta">
          <date>{publishedAt.toLocaleString('en-US')}</date>
          {
            !this.props.addingVideo && (
              !video.deleted ?
                <section>
                  <button className="btn-link" onClick={this.onMoveClick}>
                    Move
                  </button>
                  &middot;
                  <button className="btn-link" onClick={this.onTrashClick}>
                    🗑
                  </button>
                </section>
              :
                <section>
                  <button className="btn-link" onClick={this.onRecoverClick}>
                    Recover {video.board && ` to ${video.board}`}{video.list && ` - ${video.list}`}
                  </button>
                  &middot;
                  <button className="btn-link" onClick={this.onDeleteClick}>
                    Delete
                  </button>
                </section>
            )
          }
        </section>
      </article>
    )
  }
}

function mapStateToProps(state) {
  return { boards: state.boards }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editVideo, deleteVideo, addBoard, addList }, dispatch)
}

VideoItem.propTypes = propTypes
VideoItem.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(VideoItem)
