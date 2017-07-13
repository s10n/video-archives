import React from 'react'
import PropTypes from 'prop-types'
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
    // TODO: Change thumbnail ratio to 16:9
    return <img src={thumbnails.high.url} alt="" height="120" />
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
    return <p><a href={channelUrl} target="_blank" rel="noopener noreferrer">{channelTitle}</a></p>
  }

  const PublishedDate = () => {
    const publishedAt = new Date(video.data.snippet.publishedAt)
    return <date>{publishedAt.toLocaleString('en-US')}</date>
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
