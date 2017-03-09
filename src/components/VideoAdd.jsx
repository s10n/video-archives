import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { addVideo } from '../actions/index'
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
  charLength: 'Type 11 characters',
  noResults: 'No results',
  videoExists: 'Video exists'
}

const propTypes = {
  listName: React.PropTypes.string,
  videoStorage: React.PropTypes.object.isRequired,
  addVideo: React.PropTypes.func.isRequired
}

const defaultProps = {
  listName: '',
  videoStorage: {},
  addVideo: () => console.log('addVideo not defined')
}

class VideoAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      videoId: '',
      fetchResult: null,
      video: { list: this.props.listName, source: 'YouTube', data: {} }
    }
    this.onInputChange = this.onInputChange.bind(this)
  }

  onInputChange(event) {
    const video_id = event.target.value
    this.setState({ ...this.state, videoId: event.target.value })

    if (video_id.length === API_INFO.videoIdLength) {
      fetch(`${API_INFO.url}?id=${video_id}&part=${API_INFO.part}&fields=${API_INFO.fields}&key=${API_INFO.key}`)
        .then(response => response.json())
        .then(({items}) => this.setState(items.length ?
          { ...this.state, fetchResult: true, video: { ...this.state.video, data: items[0] } } :
          { ...this.state, fetchResult: false }
        ))
    }
  }

  onPressEnter() {
    if (this.state.video.list && !_.isEmpty(this.state.video.data)) {
      this.props.addVideo(this.state.video)
      this.setState({
        videoId: '',
        fetchResult: null,
        video: { ...this.state.video, data: {} }
      })
    } else {
      console.log('List name is required.') // TODO
    }
  }

  showFetchResult() {
    const videoId = this.state.videoId
    const existVideo = _.find(
      this.props.videoStorage.videos,
      video => {return video.data.id === videoId}
    )

    if (videoId.length !== API_INFO.videoIdLength) {
      return (
        <p className="HelpBlock">
          <small>{ERROR_MESSAGE.charLength}</small>
        </p>
      )
    } else if (existVideo) {
      /* TODO: If existVideo is in Trash, just recover it to current list */
      return (
        <p className="HelpBlock">
          <small>
            {ERROR_MESSAGE.videoExists}: {!existVideo.deleted ? `List ${existVideo.list}` : 'Trash'}
          </small>
        </p>
      )
    } else if (this.state.fetchResult === false) {
      return (
        <p className="HelpBlock">
          <small>{ERROR_MESSAGE.noResults}</small>
        </p>
      )
    } else if (!this.state.video.data.hasOwnProperty('id')) {
      return (
        <p className="HelpBlock">
          <small>Fetching...</small>
        </p>
      )
    } else {
      return (
        <div>
          <p><small className="strong">Press enter key to add this video &crarr;</small></p>
          <VideoItem video={this.state.video} />
        </div>
      )
    }
  }

  render() {
    return (
      <section className="VideoAdd">
        {this.state.videoId.length > 0 &&
          <section className="FetchResult">
            {this.showFetchResult()}
          </section>
        }

        <input
          type="hidden"
          onChange={event => this.setState({ listName: event.target.value })}
          value={this.state.video.list}
          placeholder="List name"
        />
        <input
          type="text"
          onChange={this.onInputChange}
          onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
          value={this.state.videoId}
          placeholder="Add a video..."
        />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { videoStorage: state.videoStorage }
}

VideoAdd.propTypes = propTypes
VideoAdd.defaultProps = defaultProps

export default connect(mapStateToProps, { addVideo })(VideoAdd)
