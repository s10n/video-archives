import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editList, deleteList } from '../actions'
import './VideoList.css'
import VideoItem from './VideoItem'
import VideoAdd from './VideoAdd'

const propTypes = {
  list: React.PropTypes.object.isRequired,
  videoList: React.PropTypes.object.isRequired,
  currentBoard: React.PropTypes.object.isRequired,
  editList: React.PropTypes.func.isRequired,
  deleteList: React.PropTypes.func.isRequired
}

const defaultProps = {
  list: {},
  videoList: {},
  currentBoard: {},
  editList: () => console.warn('editList not defined'),
  deleteList: () => console.warn('deleteList not defined')
}

export class VideoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isEditing: false, name: '', slug: '', error: null }
    this.handleNameClick = this.handleNameClick.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePressEnter = this.handlePressEnter.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleNameClick() {
    const { name, slug } = this.props.list

    this.setState({ isEditing: true, name, slug })
  }

  handleInputBlur() {
    const { name, slug } = this.props.list

    this.setState({ isEditing: false, name, slug, error: null })
  }

  handleInputChange(event) {
    const name = event.target.value
    const slug = name.trim().toString().toLowerCase().replace(/\s+/g, '-')
      .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=/g, '-').replace(/--+/g, '-')
    const listExists = _.find(
      this.props.currentBoard.lists,
      list => {return list.slug === slug && list.slug !== this.props.list.slug}
    )
    const error = listExists && 'List exists'

    this.setState({ name, slug, error })
  }

  handlePressEnter() {
    const list = this.props.list
    const name = this.state.name.trim()
    const { slug, error } = this.state

    if (name && slug && !error) {
      this.props.editList(list, { name, slug }, this.props.currentBoard)
      this.listNameInput.blur()
    }
  }

  handleDeleteClick() {
    const list = this.props.list

    if (confirm(`Delete ${list.name}?\nAll videos will be deleted.`)) {
      this.props.deleteList(list, this.props.currentBoard)
    }
  }

  render() {
    const board = this.props.currentBoard
    const list = this.props.list
    const videoList = this.props.videoList

    const ListHeader = list => {
      return (
        <header className="CardHeader ListHeader">
          <input
            className="CardTitle ListName borderless-input"
            type="text"
            onFocus={!_.isEmpty(list) && this.handleNameClick}
            onBlur={this.handleInputBlur}
            onChange={this.handleInputChange}
            onKeyPress={event => {(event.key === 'Enter') && this.handlePressEnter()}}
            value={!this.state.isEditing ? (list.name || '📥') : this.state.name}
            ref={input => {this.listNameInput = input}}
            readOnly={_.isEmpty(list)}
          />

          {!_.isEmpty(list) &&
            <button className="BtnTrash btn-link" onClick={this.handleDeleteClick}>🗑</button>
          }

          {this.state.error &&
            <small className="HelpBlock">{this.state.error}</small>
          }
        </header>
      )
    }

    const listScroll = videos => {
      // return videos.map(video => {
      //   const condition =
      //     video.board === board.slug &&
      //     (_.isEmpty(list) ? !video.list : video.list === list.slug) &&
      //     !video.deleted

      //   return condition && <VideoItem video={video} key={video.data.id} />
      // })
    }

    const styleIE = () => {
      const ua = window.navigator.userAgent
      return (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0) ?
        { maxHeight: window.innerHeight - 480 } : {}
    }

    return (
      <article className="Card">
        {ListHeader(list)}

        <div className="CardScroll" style={styleIE()}>
          {listScroll(videoList)}
        </div>

        <VideoAdd boardSlug={board.slug} listSlug={list.slug} />
      </article>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editList, deleteList }, dispatch)
}

VideoList.propTypes = propTypes
VideoList.defaultProps = defaultProps

export default connect(null, mapDispatchToProps)(VideoList)
