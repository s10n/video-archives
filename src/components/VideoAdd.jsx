import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { errorMessages } from '../constants/app'
import { youtube as youtubeAPI } from '../constants/api'
import { getParam } from '../constants/utils'
import './VideoAdd.css'
import Video from './Video'

const propTypes = {
  boards: PropTypes.object.isRequired,
  board: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired
}

const getVideoID = videoURI => {
  if (videoURI.length === youtubeAPI.idLength) {
    return { id: videoURI, error: null }
  } else if (!videoURI.length) {
    return { id: null, error: null }
  } else {
    let id = getParam(videoURI)
    return { id, error: id && id.length === youtubeAPI.idLength ? null : 'invalid' }
  }
}

class VideoAdd extends Component {
  constructor(props) {
    super(props)

    const { board, list } = this.props

    this.state = {
      videoURI: '',
      error: null,
      video: { board: board.key, list: list.key, source: 'YouTube', data: {} }
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(videoURI) {
    const { videos } = this.props
    const { video } = this.state
    this.setState({ videoURI })

    /* Check URI length */
    const { id } = getVideoID(videoURI)
    this.setState({ error: getVideoID(videoURI).error })

    /* Find duplications */
    let existVideo = false
    if (id) {
      existVideo = _.find(videos, ['data.id', id])
      this.setState({ existVideo, error: 'exists' })
    }

    /* Fetch video */
    if (id && !existVideo) {
      const params = { ...youtubeAPI.params, id }
      this.setState({ error: 'fetching' })
      axios.get(youtubeAPI.url, { params }).then(({ data }) => {
        const { items } = data
        this.setState(
          items.length
            ? { error: 'success', video: { ...video, data: items[0] } }
            : { error: 'noResults' }
        )
      })
    }
  }

  handlePressEnter() {
    const { video, error } = this.state

    if (error === 'success') {
      this.props.onAdd(video)
      this.setState({
        videoURI: '',
        error: null,
        video: { ...video, data: {} }
      })
    }
  }

  renderFetchResult() {
    const { boards } = this.props
    const { video, error, existVideo } = this.state
    const className = `HelpBlock ${error === 'success' ? 'success strong' : 'error'}`
    let additionalMessage = ''

    if (error === 'exists') {
      // TODO: If existVideo is in Trash, just recover it to current list
      const existVideoBoard = boards[existVideo.board]
      const existVideoList = existVideoBoard && existVideoBoard.lists[existVideo.list]
      additionalMessage = !existVideo.deleted
        ? `: ${existVideoBoard.title}${existVideoList ? ' - ' + existVideoList.name : ''}`
        : `: Trash`
    }

    return error ? (
      <section className="FetchResult">
        <p className={className}>
          <small>{errorMessages.video[error] + additionalMessage}</small>
        </p>
        {error === 'success' && <Video video={video} addingVideo />}
      </section>
    ) : null
  }

  render() {
    return (
      <section className="VideoAdd">
        {this.renderFetchResult()}

        <input
          className="borderless-input"
          type="text"
          onChange={event => this.handleInputChange(event.target.value)}
          onKeyPress={event => event.key === 'Enter' && this.handlePressEnter()}
          value={this.state.videoURI}
          placeholder="Add a video..."
        />
      </section>
    )
  }
}

VideoAdd.propTypes = propTypes

const mapStateToProps = ({ videos }) => ({ videos })

export default connect(mapStateToProps)(VideoAdd)
