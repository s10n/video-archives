import React from 'react'
import VideoItem from './VideoItem'

const propTypes = {
  listName: React.PropTypes.string.isRequired,
  videoList: React.PropTypes.array.isRequired
}

const defaultProps = {
  listName: '',
  videoList: []
}

class VideoList extends React.Component {
  render() {
    const mapToComponent = list => {
      return list.map((item, i) => {
        if (item.listName === this.props.listName) {
          return <VideoItem video={item} key={i} />
        } else {
          return false
        }
      })
    }

    return (
      <section className="card">
        <h2>{this.props.listName}</h2>
        {mapToComponent(this.props.videoList)}
      </section>
    )
  }
}

VideoList.propTypes = propTypes
VideoList.defaultProps = defaultProps

export default VideoList
