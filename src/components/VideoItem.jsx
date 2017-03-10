import React from 'react'
import { connect } from 'react-redux'
import { editVideo, deleteVideo } from '../actions/index'
import './VideoItem.css'

const propTypes = {
  video: React.PropTypes.object.isRequired,
  editVideo: React.PropTypes.func.isRequired,
  deleteVideo: React.PropTypes.func.isRequired
}

const defaultProps = {
  video: {},
  editVideo: () => console.log('editVideo not defined'),
  deleteVideo: () => console.log('deleteVideo not defined')
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
    const list = prompt(`Type a slug of list`)

    if (list) {
      this.props.editVideo(this.props.video, { list: list })
    }
  }

  onTrashClick() {
    this.props.editVideo(this.props.video, { deleted: true })
  }

  onRecoverClick() {
    const board = this.props.video.board || prompt(`Type a slug of board`)
    this.props.editVideo(this.props.video, { board, deleted: false })
  }

  onDeleteClick() {
    this.props.deleteVideo(this.props.video)
  }

  render() {
    const video = this.props.video
    const url = `https://www.youtube.com/watch?v=${video.data.id}`
    const publishedAt = new Date(video.data.snippet.publishedAt)

    return (
      <article className="VideoItem">
        {/* TODO: Change thumbnail ratio to 16:9 */}
        <img src={video.data.snippet.thumbnails.high.url} role="presentation" height="120" />

        <h3 className="VideoTitle">
          <a href={url} target="_blank">{video.data.snippet.title}</a>
        </h3>

        <section className="VideoMeta">
          <date>{publishedAt.toLocaleString('en-US')}</date>
          {/* TODO: if not video-add */}
          {
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
          }
        </section>
      </article>
    )
  }
}

VideoItem.propTypes = propTypes
VideoItem.defaultProps = defaultProps

export default connect(null, { editVideo, deleteVideo })(VideoItem)
