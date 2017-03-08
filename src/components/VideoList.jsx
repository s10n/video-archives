import React from 'react'
import './VideoList.css'
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
      <article className="VideoList">
        <h2 className="ListName">{listName}</h2>

        <div className="ListScroll">
          {mapToComponent(this.props.videoList)}
        </div>

        <VideoAdd listName={listName} />
      </article>
    )
  }
}

VideoList.propTypes = propTypes
VideoList.defaultProps = defaultProps

export default VideoList
