import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { addVideo } from '../actions/index'
import VideoItem from './VideoItem'

const API_INFO = {
  url    : 'https://www.googleapis.com/youtube/v3/videos',
  key    : 'AIzaSyBOMBvSTv2siglJCEOybx5MD_KzerZ1WLg',
  part   : 'snippet,contentDetails',
  fields : 'items(id,snippet(publishedAt,channelId,title,thumbnails,channelTitle,categoryId),' +
           'contentDetails(duration))',
  videoIdLength : 11
}

const ERROR_MESSAGE = 'No results'

const propTypes = {
  addVideo: React.PropTypes.func.isRequired,
  listName: React.PropTypes.string
}

const defaultProps = {
  addVideo: () => console.log('addVideo not defined'),
  listName: ''
}

class VideoAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = { listName: this.props.listName, videoId: '', videoData: {} }
    this.onInputChange = this.onInputChange.bind(this)
    this.onClickButton = this.onClickButton.bind(this)
  }

  onInputChange(event) {
    const video_id = event.target.value
    this.setState({ ...this.statem, videoId: event.target.value })

    if (video_id.length === API_INFO.videoIdLength) {
      fetch(`${API_INFO.url}?id=${video_id}&part=${API_INFO.part}&fields=${API_INFO.fields}&key=${API_INFO.key}`)
        .then(response => response.json())
        .then(({items}) => this.setState({ ...this.state, videoData: items.length ? items[0] : {} }))
    }
  }

  onClickButton() {
    if (this.state.listName && !_.isEmpty(this.state.videoData)) {
      this.props.addVideo(this.state)
      this.setState({ ...this.state, videoId: '', videoData: {} })
    } else {
      console.log('List name is required.') // TODO
    }
  }

  render() {
    const videoData = this.state.videoData
    const errorMessage = ERROR_MESSAGE

    return (
      <section>
        <input
          type="text"
          onChange={event => this.setState({ listName: event.target.value })}
          value={this.state.listName}
          placeholder="List name"
        />
        <input
          type="text"
          onChange={this.onInputChange}
          value={this.state.videoId}
          placeholder="Video ID"
        />
        <button type="button" onClick={this.onClickButton}>추가</button>

        {videoData.hasOwnProperty('id') ? <VideoItem video={this.state} /> : <p>{errorMessage}</p>}
      </section>
    )
  }
}

VideoAdd.propTypes = propTypes
VideoAdd.defaultProps = defaultProps

export default connect(null, { addVideo })(VideoAdd)
