import React from 'react'
import VideoItem from './VideoItem'
import VideoAdd from './VideoAdd'

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
    const listName = this.props.listName
    const mapToComponent = list => {
      return list.map((item, i) => {
        if (item.listName === listName) {
          return <VideoItem video={item} key={i} />
        } else {
          return false
        }
      })
    }

    return (
      <section className="card">
        <h2>{listName}</h2>
        {mapToComponent(this.props.videoList)}

        <VideoAdd listName={listName} />
      </section>
    )
  }
}

VideoList.propTypes = propTypes
VideoList.defaultProps = defaultProps

export default VideoList
