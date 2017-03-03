import React from 'react'
import VideoItem from './VideoItem'

const propTypes = {
  videoList: React.PropTypes.array.isRequired
}

const defaultProps = {
  videoList: []
}

class VideoList extends React.Component {
  render() {
    const mapToComponent = list => {
      return list.map((item, i) => {
        return <VideoItem video={item} key={i} />
      })
    }

    return (
      <section>
        <h1>Video list</h1>
        {mapToComponent(this.props.videoList)}
      </section>
    )
  }
}

VideoList.propTypes = propTypes
VideoList.defaultProps = defaultProps

export default VideoList
