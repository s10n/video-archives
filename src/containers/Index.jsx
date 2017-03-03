import React from 'react'
import VideoList from '../components/VideoList'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = { videoStorage: { boards: [], videos: [] } }
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

  render() {
    const currentVideoStorage = this.state.videoStorage

    return (
      <section>
        <VideoList videoList={currentVideoStorage.videos} />
        {/*<pre>{JSON.stringify(currentVideoStorage, null, 2)}</pre>*/}
      </section>
    )
  }
}

export default Index
