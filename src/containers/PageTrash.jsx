import React from 'react'
import { connect } from 'react-redux'
import './PageTrash.css'
import VideoItem from '../components/VideoItem'

const propTypes = {
  videoStorage: React.PropTypes.object.isRequired
}

const defaultProps = {
  videoStorage: {}
}

class PageTrash extends React.Component {
  render() {
    const mapToComponent = videos => {
      return videos.map(video => {
        if (video.deleted) {
          return <VideoItem video={video} key={video.data.id} />
        } else {
          return false
        }
      })
    }

    return (
      <section>
        <h1 className="page-title">Trash</h1>
        <main className="page-content">
          <section className="card">
            {mapToComponent(this.props.videoStorage.videos)}
          </section>
        </main>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { videoStorage: state.videoStorage }
}

PageTrash.propTypes = propTypes
PageTrash.defaultProps = defaultProps

export default connect(mapStateToProps)(PageTrash)
