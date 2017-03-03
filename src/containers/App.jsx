import _ from 'lodash'
import React from 'react'
import Sidebar from './Sidebar'
import VideoAdd from '../components/VideoAdd'
import '../App.css'

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

    if (!_.find(currentVideoStorage.boards, o => {return o.name === name})) {
      this.setState({
        videoStorage: {
          boards: [ ...currentVideoStorage.boards, { name: name, lists: [] } ],
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
      <div className="container-fluid" style={{ marginTop: '15px' }}>
        <div className="row">
          <div className="col-sm-3">
            <Sidebar boardsList={currentVideoStorage.boards} onSubmitBoard={this.addBoard} />
          </div>
          <div className="col-sm-9">
            <main>
              {this.props.children}
              <VideoAdd onSubmitVideo={this.addVideo} />
            </main>
            {/*<pre>{JSON.stringify(currentVideoStorage, null, 2)}</pre>*/}
          </div>
        </div>
      </div>
    )
  }
}

export default Index
