import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { emptyTrash } from '../actions/video'
import Page from './Page'
import Card from './Card'
import Video from './Video'

const propTypes = {
  boards: PropTypes.object.isRequired,
  videos: PropTypes.array.isRequired,
  emptyTrash: PropTypes.func.isRequired
}

class Trash extends Component {
  constructor(props) {
    super(props)

    this.handleEmptyClick = this.handleEmptyClick.bind(this)
  }

  handleEmptyClick() {
    if (window.confirm(`Empty trash?`)) {
      const { videos, emptyTrash } = this.props
      emptyTrash(videos)
    }
  }

  render() {
    const { videos } = this.props

    const header = (
      <div style={{ textAlign: 'right' }}>
        <button className="btn-link btn-small" onClick={this.handleEmptyClick}>
          Empty
        </button>
      </div>
    )

    return (
      <Page page="Trash" title="Trash">
        <Card header={header}>
          {videos.map(video => <Video video={video} key={video.key} />)}
        </Card>
      </Page>
    )
  }
}

Trash.propTypes = propTypes

const mapStateToProps = ({ boards, videos }) => {
  videos = _.filter(videos, 'deleted')
  return { boards, videos }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ emptyTrash }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Trash)
