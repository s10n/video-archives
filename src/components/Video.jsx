import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DragSource } from 'react-dnd'
import { editVideo, deleteVideo } from '../actions/video'
import { ItemTypes } from '../constants/app'
import './Video.css'
import VideoEdit from './VideoEdit'

const propTypes = {
  video: PropTypes.object.isRequired,
  board: PropTypes.object,
  addingVideo: PropTypes.bool,
  appStatus: PropTypes.string,
  boards: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  editVideo: PropTypes.func.isRequired,
  deleteVideo: PropTypes.func.isRequired
}

const defaultProps = {
  board: {},
  addingVideo: false,
  appStatus: ''
}

const videoSource = {
  canDrag(props) {
    return !props.video.isSyncing && !props.appStatus
  },

  beginDrag(props) {
    return { video: props.video }
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) return
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
    const { video } = item
    const { board, list, trash } = dropResult

    board && props.editVideo(video, { board: board.key, list: null, deleted: null })
    list && props.editVideo(video, { list: list.key })
    trash && props.editVideo({ ...video, deleted: null }, { deleted: true })
  }
}

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})

const Video = ({ video, board, addingVideo, appStatus, boards, ...props }) => {
  const { editVideo, deleteVideo } = props
  const { connectDragSource, isDragging } = props
  const { thumbnails, title, channelTitle, channelId } = video.data.snippet
  const backgroundImage = `url(${thumbnails.high.url})`
  const url = `https://www.youtube.com/watch?v=${video.data.id}`
  const channelUrl = `https://www.youtube.com/channel/${channelId}`
  const publishedAt = new Date(video.data.snippet.publishedAt)
  const dateTime = moment(publishedAt).format('YYYY-MM-DD')
  const year = moment(publishedAt).format('YYYY')

  const thumbnail = connectDragSource(
    <section className="VideoThumbnail" style={{ backgroundImage }} />
  )

  const videoTitle = (
    <h3 className="VideoTitle">
      <a href={url} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    </h3>
  )

  const channel = (
    <a href={channelUrl} target="_blank" rel="noopener noreferrer">
      {channelTitle}
    </a>
  )

  const publishedDate = (
    <time dateTime={dateTime} title={dateTime}>
      {year}
    </time>
  )

  const propsVideoEdit = { video, board, boards, onEdit: editVideo, onDelete: deleteVideo }

  return (
    <article className="Video" style={{ opacity: isDragging && 0.5 }}>
      {thumbnail}
      {videoTitle}

      <section className="VideoMeta">
        {channel}
        {publishedDate}
        {!addingVideo && <VideoEdit {...propsVideoEdit} />}
      </section>
    </article>
  )
}

Video.propTypes = propTypes
Video.defaultProps = defaultProps

const mapStateToProps = ({ app, boards }) => ({ appStatus: app.status, boards })
const mapDispatchToProps = dispatch => bindActionCreators({ editVideo, deleteVideo }, dispatch)

const enhance = _.flow(
  DragSource(ItemTypes.VIDEO, videoSource, collect),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(Video)
