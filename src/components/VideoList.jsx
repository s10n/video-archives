import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editList, deleteList } from '../actions/list'
import './VideoList.css'
import VideoItem from './VideoItem'
import VideoAdd from './VideoAdd'

const propTypes = {
  board: PropTypes.object.isRequired,
  boardKey: PropTypes.string.isRequired,
  list: PropTypes.object.isRequired,
  listKey: PropTypes.string.isRequired,
  videos: PropTypes.array.isRequired,
  editList: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired
}

const defaultProps = {
  board: {},
  boardKey: '',
  list: {},
  listKey: '',
  videos: [],
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
      .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=|%|\./g, '-').replace(/--+/g, '-')
    const listExists = _.find(
      this.props.board.lists,
      list => {return list.slug === slug && list.slug !== this.props.list.slug}
    )
    const error = listExists && 'List exists'

    this.setState({ name, slug, error })
  }

  handlePressEnter() {
    const name = this.state.name.trim()
    const { slug, error } = this.state

    if (name && slug && !error) {
      this.props.editList(this.props.boardKey, this.props.listKey, { name, slug }, this.props.list)
      this.listNameInput.blur()
    }
  }

  handleDeleteClick() {
    const { boardKey, list, listKey, videos, deleteList } = this.props

    if (window.confirm(`Delete ${list.name}?\nAll videos will be deleted.`)) {
      deleteList(boardKey, listKey, videos, list)
    }
  }

  render() {
    const { boardKey, list, listKey, videos } = this.props

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

    const listScroll = () => {
      const videosSorted = _.sortBy(videos, 'data.snippet.publishedAt').reverse()

      return videosSorted.map(video => {
        const condition =
          !video.deleted

        return condition &&
          <VideoItem video={video} videoKey={video.key} boardKey={boardKey} listKey={listKey} key={video.key} />
      })
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
          {listScroll()}
        </div>

        {!list.isSyncing &&
          <VideoAdd boardKey={this.props.boardKey} listKey={this.props.listKey} />
        }
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
