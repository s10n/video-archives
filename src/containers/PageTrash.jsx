import React from 'react'
import { connect } from 'react-redux'
import { emptyTrash } from '../actions/index'
import './PageTrash.css'
import VideoItem from '../components/VideoItem'

const propTypes = {
  videoStorage: React.PropTypes.object.isRequired,
  emptyTrash: React.PropTypes.func.isRequired
}

const defaultProps = {
  videoStorage: {},
  emptyTrash: () => console.log('emptyTrash not defined')
}

class PageTrash extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.onEmptyClick = this.onEmptyClick.bind(this)
  }

  onEmptyClick() {
    this.props.emptyTrash()
    this.context.router.push('/')
  }

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
            <header className="card-header" style={{ textAlign: 'right' }}>
              <button className="btn-link btn-small" onClick={this.onEmptyClick}>Empty</button>
            </header>

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

export default connect(mapStateToProps, { emptyTrash })(PageTrash)
