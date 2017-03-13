import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { emptyTrash } from '../actions'
import './PageTrash.css'
import VideoItem from '../components/VideoItem'

const propTypes = {
  videoStorage: React.PropTypes.object.isRequired,
  emptyTrash: React.PropTypes.func.isRequired
}

const defaultProps = {
  videoStorage: {},
  emptyTrash: () => console.warn('emptyTrash not defined')
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
    if (confirm(`Empty trash?`)) {
      this.props.emptyTrash()
      this.context.router.push('/')
    }
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
      <section className="Page">
        <header className="PageHeader">
          <h1 className="PageTitle">Trash</h1>
        </header>

        <main className="PageContent">
          <div className="PageContentInner">
            <article className="Card">
              <header className="CardHeader" style={{ textAlign: 'right' }}>
                <button className="btn-link btn-small" onClick={this.onEmptyClick}>Empty</button>
              </header>

              <div className="CardScroll">
                {mapToComponent(this.props.videoStorage.videos)}
              </div>
            </article>
          </div>
        </main>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { videoStorage: state.videoStorage }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ emptyTrash }, dispatch)
}

PageTrash.propTypes = propTypes
PageTrash.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(PageTrash)
