import _ from 'lodash'
import axios from 'axios'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addVideo } from '../actions'
import './VideoAdd.css'
import VideoItem from './VideoItem'

const API_INFO = {
  url    : 'https://www.googleapis.com/youtube/v3/videos',
  key    : 'AIzaSyBOMBvSTv2siglJCEOybx5MD_KzerZ1WLg',
  part   : 'snippet,contentDetails',
  fields : 'items(id,snippet(publishedAt,channelId,title,thumbnails,channelTitle,categoryId),' +
           'contentDetails(duration))',
  videoIdLength : 11
}

const ERROR_MESSAGE = {
  invalid: 'Type valid url',
  fetching: 'Fetching...',
  noResults: 'No results',
  videoExists: 'Video exists'
}

const propTypes = {
  boardSlug: React.PropTypes.string,
  listSlug: React.PropTypes.string,
  boards: React.PropTypes.array.isRequired,
  videos: React.PropTypes.array.isRequired,
  addVideo: React.PropTypes.func.isRequired
}

const defaultProps = {
  boardSlug: '',
  listSlug: '',
  boards: [],
  videos: [],
  addVideo: () => console.warn('addVideo not defined')
}

class VideoAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      videoUri: '',
      videoId: '',
      errorCode: null,
      video: { board: this.props.boardSlug, list: this.props.listSlug, source: 'YouTube', data: {} }
    }
    this.onInputChange = this.onInputChange.bind(this)
  }

  onInputChange(event) {
    const fetchUrl = `${API_INFO.url}` +
      `?part=${API_INFO.part}&fields=${API_INFO.fields}&key=${API_INFO.key}`
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

    const videoUri = event.target.value
    this.setState({ videoUri })

    /* Check URI length */
    let videoId = ''
    if (videoUri.length === API_INFO.videoIdLength) {
      videoId = videoUri
    } else if (!videoUri.length) {
      this.setState({ errorCode: null })
    } else {
      let params = getParams(videoUri)

      if (params.hasOwnProperty('v') && params.v.length === API_INFO.videoIdLength) {
        videoId = params.v
      } else {
        this.setState({ errorCode: 'invalid' })
      }
    }

    /* Find duplications */
    let existVideo = ''
    if (videoId) {
      existVideo = _.find(
        this.props.videos,
        video => {return video.data.id === videoId}
      )
      this.setState({ errorCode: 'videoExists', existVideo })
    }

    /* Fetch video */
    if (videoId && !existVideo) {
      this.setState({ errorCode: 'fetching' })

      const request = axios.get(`${fetchUrl}&id=${videoId}`)
      request.then(({ data }) => {
        const { items } = data
        this.setState(items.length ?
          { errorCode: 'success', video: { ...this.state.video, data: items[0] } } :
          { errorCode: 'noResults' }
        )
      })
    }
  }

  onPressEnter() {
    if (this.state.errorCode === 'success') {
      this.props.addVideo(this.state.video)
      this.setState({
        videoUri: '',
        videoId: '',
        errorCode: null,
        video: { ...this.state.video, data: {} }
      })
    }
  }

  showFetchResult() {
    const errorCode = this.state.errorCode

    // TODO: If existVideo is in Trash, just recover it to current list
    const existVideo = this.state.existVideo
    const additionalMessage = (errorCode === 'videoExists') ?
      (!existVideo.deleted ? ` : ${existVideo.board} - ${existVideo.list}` : ' : Trash') :
      ''

    if (errorCode === 'success') {
      return (
        <div>
          <p><small className="strong">Press enter key to add this video &crarr;</small></p>
          <VideoItem video={this.state.video} addingVideo />
        </div>
      )
    } else if (errorCode) {
      return (
        <p className="HelpBlock">
          <small>
            {ERROR_MESSAGE[errorCode] + additionalMessage}
          </small>
        </p>
      )
    }
  }

  render() {
    return (
      <section className="VideoAdd">
        {this.state.errorCode &&
          <section className="FetchResult">
            {this.showFetchResult()}
          </section>
        }

        <input
          type="text"
          onChange={this.onInputChange}
          onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
          value={this.state.videoUri}
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
