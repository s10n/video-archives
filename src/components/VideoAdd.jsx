import _ from 'lodash'
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addVideo } from '../actions'
import { youtubeAPIKey } from '../config'
import './VideoAdd.css'
import VideoItem from './VideoItem'

export const API_INFO = {
  url    : 'https://www.googleapis.com/youtube/v3/videos',
  key    : youtubeAPIKey,
  part   : 'snippet,contentDetails',
  fields : 'items(id,snippet(publishedAt,channelId,title,thumbnails,channelTitle,categoryId),' +
           'contentDetails(duration))',
  videoIDLength : 11
}

export const ERROR_MESSAGE = {
  invalid: 'Type valid url',
  exists: 'Video exists',
  fetching: 'Fetching...',
  noResults: 'No results',
  success: 'Press enter key to add this video ↵'
}

const propTypes = {
  boardKey: PropTypes.string,
  listKey: PropTypes.string,
  boards: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
  addVideo: PropTypes.func.isRequired
}

const defaultProps = {
  boardKey: '',
  listKey: '',
  boards: {},
  videos: {},
  addVideo: () => console.warn('addVideo not defined')
}

export class VideoAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      videoURI: '',
      videoID: '',
      error: null,
      video: { board: this.props.boardKey, list: this.props.listKey, source: 'YouTube', data: {} }
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    const getParams = uri => {
      let hashes = uri.slice(uri.indexOf('?') + 1).split('&')
      let params = {}
      hashes.map(hash => {
        let [key, value] = hash.split('=')
        params[key] = decodeURIComponent(value)
        return null
      })
      return params
    }

    const videoURI = event.target.value
    this.setState({ videoURI })

    /* Check URI length */
    let videoID = ''
    if (videoURI.length === API_INFO.videoIDLength) {
      videoID = videoURI
    } else if (!videoURI.length) {
      this.setState({ error: null })
    } else {
      let params = getParams(videoURI)

      if (params.hasOwnProperty('v') && params.v.length === API_INFO.videoIDLength) {
        videoID = params.v
      } else {
        this.setState({ error: 'invalid' })
      }
    }

    /* Find duplications */
    let existVideo = ''
    if (videoID) {
      existVideo = _.find(this.props.videos, video => {return video.data.id === videoID})
      this.setState({ error: 'exists', existVideo })
    }

    /* Fetch video */
    if (videoID && !existVideo) {
      this.setState({ error: 'fetching' })

      const params = {
        key: API_INFO.key,
        part: API_INFO.part,
        fields: API_INFO.fields,
        id: videoID
      }
      const request = axios.get(API_INFO.url, { params })
      request.then(({ data }) => {
        const { items } = data
        this.setState(items.length ?
          { error: 'success', video: { ...this.state.video, data: items[0] } } :
          { error: 'noResults' }
        )
      })
    }
  }

  handlePressEnter() {
    if (this.state.error === 'success') {
      this.props.addVideo(this.state.video)
      this.setState({
        videoURI: '',
        videoID: '',
        error: null,
        video: { ...this.state.video, data: {} }
      })
    }
  }

  showFetchResult() {
    const error = this.state.error
    let additionalMessage = ''

    if (error === 'exists') {
      // TODO: If existVideo is in Trash, just recover it to current list
      const existVideo = this.state.existVideo
      const existVideoBoard = this.props.boards[existVideo.board]
      const existVideoList = existVideoBoard.lists[existVideo.list]
      additionalMessage = !existVideo.deleted ?
        `: ${existVideoBoard.title} - ${existVideoList.name}` : ' : Trash'
    }

    if (error === 'success') {
      return (
        <div>
          <p className="HelpBlock success strong">
            <small>{ERROR_MESSAGE[error] + additionalMessage}</small>
          </p>
          <VideoItem video={this.state.video} addingVideo />
        </div>
      )
    } else if (error) {
      return (
        <p className="HelpBlock error">
          <small>{ERROR_MESSAGE[error] + additionalMessage}</small>
        </p>
      )
    }
  }

  render() {
    return (
      <section className="VideoAdd">
        {this.state.error &&
          <section className="FetchResult">
            {this.showFetchResult()}
          </section>
        }

        <input
          className="borderless-input"
          type="text"
          onChange={this.handleInputChange}
          onKeyPress={event => {(event.key === 'Enter') && this.handlePressEnter()}}
          value={this.state.videoURI}
          placeholder="Add a video..."
        />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { boards: state.boards, videos: state.videos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addVideo }, dispatch)
}

VideoAdd.propTypes = propTypes
VideoAdd.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(VideoAdd)
