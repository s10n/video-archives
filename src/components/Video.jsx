import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import './Video.css'
import VideoEdit from './VideoEdit'

const propTypes = {
  video: PropTypes.object.isRequired,
  board: PropTypes.object,
  addingVideo: PropTypes.bool
}

const Video = ({ video, board, addingVideo }) => {
  const { thumbnails, title, channelTitle, channelId } = video.data.snippet

  const Thumbnail = () => {
    const backgroundImage = `url(${thumbnails.high.url})`
    return <section className="VideoThumbnail" style={{ backgroundImage }} />
  }

  const Title = () => {
    const url = `https://www.youtube.com/watch?v=${video.data.id}`

    return (
      <h3 className="VideoTitle">
        <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
      </h3>
    )
  }

  const ChannelTitle = () => {
    const channelUrl = `https://www.youtube.com/channel/${channelId}`
    return <a href={channelUrl} target="_blank" rel="noopener noreferrer">{channelTitle}</a>
  }

  const PublishedDate = () => {
    const publishedAt = new Date(video.data.snippet.publishedAt)
    const dateTime = moment(publishedAt).format('YYYY-MM-DD')
    const year = moment(publishedAt).format('YYYY')
    return <time dateTime={dateTime} title={dateTime}>{year}</time>
  }

  return (
    <article className="Video">
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

export default Video
