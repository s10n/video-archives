import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editVideo, deleteVideo, addBoard, addList } from '../actions'
import './VideoItem.css'

const propTypes = {
  video: React.PropTypes.object.isRequired,
  videoKey: React.PropTypes.string,
  boards: React.PropTypes.object.isRequired,
  boardKey: React.PropTypes.string,
  listKey: React.PropTypes.string,
  addingVideo: React.PropTypes.bool,
  editVideo: React.PropTypes.func.isRequired,
  deleteVideo: React.PropTypes.func.isRequired,
  addBoard: React.PropTypes.func.isRequired,
  addList: React.PropTypes.func.isRequired
}

const defaultProps = {
  video: {},
  videoKey: '',
  boards: {},
  boardKey: '',
  listKey: '',
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
    const { boardKey, videoKey, boards, editVideo } = this.props
    const name = prompt(`Type a name or slug of list`).trim()
    const slug = name.trim().toString().toLowerCase().replace(/\s+/g, '-')

    if (name && slug) {
      const newListKey = _.findKey(boards[boardKey].lists, ['slug', slug])
      // const list = { name, slug }
      // newListKey || addList(boardKey, list)
      newListKey || alert('Error')
      newListKey && editVideo(videoKey, { list: newListKey })
    }
  }

  handleTrashClick() {
    this.props.editVideo(this.props.videoKey, { deleted: true })
  }

  handleRecoverClick() {
    const { video, videoKey, boards, editVideo } = this.props
    const title = video.board ? boards[video.board].title : prompt(`Type a name or slug of board`).trim()
    const slug = title.trim().toString().toLowerCase().replace(/\s+/g, '-')

    if (title && slug) {
      const newBoardKey = _.findKey(boards, ['slug', slug])
      // const board = { title, slug }
      // newBoardKey || addBoard(board)
      newBoardKey || alert('Error')
      newBoardKey && editVideo(videoKey, { board: newBoardKey, deleted: false })
    }
  }

  handleDeleteClick() {
    confirm(`Delete?`) && this.props.deleteVideo(this.props.video)
  }

  render() {
    const video = this.props.video
    const board = this.props.boards[video.board]
    const url = `https://www.youtube.com/watch?v=${video.data.id}`
    const publishedAt = new Date(video.data.snippet.publishedAt)

    const videoItemFunctions = () => {
      const location = (
        <span>{video.board && ` to ${board.title}`}{video.list && ` - ${board.lists[video.list].name}`}</span>
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
