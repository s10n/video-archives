import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { emptyTrash } from '../actions/video'
import './PageTrash.css'
import Page from './Page'
import VideoItem from '../components/VideoItem'

const propTypes = {
  boards: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
  emptyTrash: PropTypes.func.isRequired
}

const defaultProps = {
  boards: {},
  videos: {},
  emptyTrash: () => console.warn('emptyTrash not defined')
}

class PageTrash extends React.Component {
  constructor(props) {
    super(props)
    this.handleEmptyClick = this.handleEmptyClick.bind(this)
  }

  handleEmptyClick() {
    if (window.confirm(`Empty trash?`)) {
      const videos = _.pickBy(this.props.videos, ['deleted', true])
      this.props.emptyTrash(videos)
    }
  }

  render() {
    const mapToComponent = videos => {
      return Object.keys(videos).map(key => {
        const video = videos[key]
        return video.deleted && <VideoItem video={video} videoKey={key} key={key} />
      })
    }

    return (
      <Page page="Trash" title="Trash">
        <article className="Card">
          <header className="CardHeader" style={{ textAlign: 'right' }}>
            <button className="btn-link btn-small" onClick={this.handleEmptyClick}>Empty</button>
          </header>

          <div className="CardScroll">
            {mapToComponent(this.props.videos)}
          </div>
        </article>
      </Page>
    )
  }
}

function mapStateToProps(state) {
  return { boards: state.boards, videos: state.videos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ emptyTrash }, dispatch)
}

PageTrash.propTypes = propTypes
PageTrash.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(PageTrash)
