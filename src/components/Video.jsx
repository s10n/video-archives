import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { DragSource } from 'react-dnd'
import { editVideo } from '../actions/video'
import { ItemTypes } from '../config/constants'
import './Video.css'
import VideoEdit from './VideoEdit'

const propTypes = {
  video: PropTypes.object.isRequired,
  board: PropTypes.object,
  addingVideo: PropTypes.bool,
  appStatus: PropTypes.string,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  editVideo: PropTypes.func.isRequired
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

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const Video = ({ video, board, addingVideo, appStatus, connectDragSource, isDragging }) => {
  const { thumbnails, title, channelTitle, channelId } = video.data.snippet

  const Thumbnail = () => {
    const backgroundImage = `url(${thumbnails.high.url})`
    return connectDragSource(<section className="VideoThumbnail" style={{ backgroundImage }} />)
  }

  const Title = () => {
    const url = `https://www.youtube.com/watch?v=${video.data.id}`

    return (
      <h3 className="VideoTitle">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h3>
    )
  }

  const ChannelTitle = () => {
    const channelUrl = `https://www.youtube.com/channel/${channelId}`
    return (
      <a href={channelUrl} target="_blank" rel="noopener noreferrer">
        {channelTitle}
      </a>
    )
  }

  const PublishedDate = () => {
    const publishedAt = new Date(video.data.snippet.publishedAt)
    const dateTime = moment(publishedAt).format('YYYY-MM-DD')
    const year = moment(publishedAt).format('YYYY')
    return (
      <time dateTime={dateTime} title={dateTime}>
        {year}
      </time>
    )
  }

  return (
    <article className="Video" style={{ opacity: isDragging && 0.5 }}>
      <Thumbnail />
      <Title />

      <section className="VideoMeta">
        <ChannelTitle />
        <PublishedDate />
        {!addingVideo && <VideoEdit video={video} board={board} />}
      </section>
    </article>
  )
}

Video.propTypes = propTypes
Video.defaultProps = defaultProps

function mapStateToProps({ app }) {
  return { appStatus: app.status }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editVideo }, dispatch)
}

const enhance = _.flow(
  DragSource(ItemTypes.VIDEO, videoSource, collect),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(Video)
