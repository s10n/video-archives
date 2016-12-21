import _ from 'lodash'
import React from 'react'
import VideoItem from './VideoItem'

const API_INFO = {
  url    : 'https://www.googleapis.com/youtube/v3/videos',
  key    : 'AIzaSyBOMBvSTv2siglJCEOybx5MD_KzerZ1WLg',
  part   : 'snippet,contentDetails',
  fields : 'items(id,snippet(publishedAt,channelId,title,thumbnails,channelTitle,categoryId),' +
           'contentDetails(duration))',
  sampleVideoId : 'PmYqo0xJW1k',
  videoIdLength : 11
}

const ERROR_MESSAGE = 'No results'

const propTypes = {
  onSubmitVideo: React.PropTypes.func.isRequired
}

const defaultProps = {
  onSubmitVideo: () => console.error('onSubmitVideo not defined')
}

class VideoAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = { listName: '', videoData: {} }
    this.onInputChange = this.onInputChange.bind(this)
    this.onClickButton = this.onClickButton.bind(this)
  }

  onInputChange(event) {
    const video_id = event.target.value

    if (video_id.length === API_INFO.videoIdLength) {
      fetch(`${API_INFO.url}?id=${video_id}&part=${API_INFO.part}&fields=${API_INFO.fields}&key=${API_INFO.key}`)
        .then(response => response.json())
        .then(({items}) => this.setState({ videoData: items.length ? items[0] : {} }))
    }
  }

  onClickButton() {
    if (this.state.listName && !_.isEmpty(this.state.videoData)) {
      this.props.onSubmitVideo({ listName: this.state.listName, videoData: this.state.videoData })
      this.setState({ listName: '', videoData: {} })
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
          onChange={this.onInputChange}
          defaultValue={API_INFO.sampleVideoId} />
        <input
          type="text"
          onChange={event => this.setState({ listName: event.target.value })}
          value={this.state.listName}
          placeholder="List name" />
        <button type="button" onClick={this.onClickButton}>추가</button>

        <article>
          {videoData.hasOwnProperty('id') ? <VideoItem video={this.state} /> : <p>{errorMessage}</p>}
        </article>
      </section>
    )
  }
}

VideoAdd.propTypes = propTypes
VideoAdd.defaultProps = defaultProps

export default VideoAdd
