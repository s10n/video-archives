import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editVideo, deleteVideo, addBoard, addList } from '../actions'
import './VideoItem.css'

const propTypes = {
  video: React.PropTypes.object.isRequired,
  boards: React.PropTypes.object.isRequired,
  addingVideo: React.PropTypes.bool,
  editVideo: React.PropTypes.func.isRequired,
  deleteVideo: React.PropTypes.func.isRequired,
  addBoard: React.PropTypes.func.isRequired,
  addList: React.PropTypes.func.isRequired
}

const defaultProps = {
  video: {},
  boards: {},
  addingVideo: false,
  editVideo: () => console.warn('editVideo not defined'),
  deleteVideo: () => console.warn('deleteVideo not defined'),
  addBoard: () => console.warn('addBoard not defined'),
  addList: () => console.warn('addList not defined')
}

export class VideoItem extends React.Component {
  constructor(props) {
    super(props)
    this.handleMoveClick = this.handleMoveClick.bind(this)
    this.handleTrashClick = this.handleTrashClick.bind(this)
    this.handleRecoverClick = this.handleRecoverClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleMoveClick() {
    const name = prompt(`Type a name or slug of list`).trim()
    const slug = name.trim().toString().toLowerCase().replace(/\s+/g, '-')

    if (name && slug) {
      const board = _.find(this.props.boards, ['slug', this.props.video.board])
      const listExists = _.find(board.lists, ['slug', slug])
      const list = { name, slug }
      listExists || this.props.addList(list, board.slug)
      this.props.editVideo(this.props.video, { list: slug })
    }
  }

  handleTrashClick() {
    this.props.editVideo(this.props.video, { deleted: true })
  }

  handleRecoverClick() {
    const title = this.props.video.board || prompt(`Type a name or slug of board`).trim()
    const slug = title.trim().toString().toLowerCase().replace(/\s+/g, '-')

    if (title && slug) {
      const boardExists = _.find(this.props.boards, ['slug', slug])
      const board = { title, slug }
      boardExists || this.props.addBoard(board)
      this.props.editVideo(this.props.video, { board: slug, deleted: false })
    }
  }

  handleDeleteClick() {
    confirm(`Delete?`) && this.props.deleteVideo(this.props.video)
  }

  render() {
    const video = this.props.video
    const url = `https://www.youtube.com/watch?v=${video.data.id}`
    const publishedAt = new Date(video.data.snippet.publishedAt)

    const videoItemFunctions = () => {
      const location = (
        <span>{video.board && ` to ${video.board}`}{video.list && ` - ${video.list}`}</span>
      )
      return (
        !video.deleted ?
          <section>
            <button className="btn-link" onClick={this.handleMoveClick}>Move</button>
            &middot;
            <button className="btn-link" onClick={this.handleTrashClick}>🗑</button>
          </section>
        :
          <section>
            <button className="btn-link" onClick={this.handleRecoverClick}>Recover {location}</button>
            &middot;
            <button className="btn-link" onClick={this.handleDeleteClick}>Delete</button>
          </section>
      )
    }

    // TODO: Change thumbnail ratio to 16:9
    return (
      <article className="VideoItem">
        <img src={video.data.snippet.thumbnails.high.url} alt="" role="presentation" height="120" />

        <h3 className="VideoTitle">
          <a href={url} target="_blank">{video.data.snippet.title}</a>
        </h3>

        <section className="VideoMeta">
          <date>{publishedAt.toLocaleString('en-US')}</date>
          {!this.props.addingVideo && videoItemFunctions()}
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
