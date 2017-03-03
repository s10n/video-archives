import _ from 'lodash'
import React from 'react'

import VideoSidebar from './VideoSidebar'
import VideoAdd from './VideoAdd'
import VideoList from './VideoList'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = { videoStorage: { boards: [], videos: [] } }
    this.addBoard = this.addBoard.bind(this)
    this.addVideo = this.addVideo.bind(this)
  }

  componentWillMount() {
    const localVideoStorage = localStorage.videoStorage

    if (localVideoStorage) {
      this.setState({ videoStorage: JSON.parse(localVideoStorage) })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const currentVideoStorage = this.state.videoStorage

    if (JSON.stringify(prevState.videoStorage) !== JSON.stringify(currentVideoStorage)) {
      localStorage.videoStorage = JSON.stringify(currentVideoStorage)
    }
  }

  addBoard(name) {
    const currentVideoStorage = this.state.videoStorage

    if (currentVideoStorage.boards.indexOf(name) === -1) {
      this.setState({
        videoStorage: {
          boards: [ ...currentVideoStorage.boards, name ],
          videos: currentVideoStorage.videos
        }
      })
    } else {
      console.log('FAIL: Board exists')
    }
  }

  addVideo(video) {
    const currentVideoStorage = this.state.videoStorage

    if (!_.find(currentVideoStorage.videos, o => {return o.videoData.id === video.videoData.id})) {
      this.setState({
        videoStorage: {
          boards: currentVideoStorage.boards,
          videos: [ ...currentVideoStorage.videos, video ]
        }
      })
    } else {
      console.log('FAIL: Video exists')
    }
  }

  render() {
    const currentVideoStorage = this.state.videoStorage

    return (
      <main>
        <VideoSidebar boardsList={currentVideoStorage.boards} onSubmitBoard={this.addBoard} />
        <VideoAdd onSubmitVideo={this.addVideo} />
        <VideoList videoList={currentVideoStorage.videos} />
        {/*<pre>{JSON.stringify(currentVideoStorage, null, 2)}</pre>*/}
      </main>
    )
  }
}

export default Index
