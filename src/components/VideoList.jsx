import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { editList, deleteList } from '../actions/index'
import './VideoList.css'
import VideoItem from './VideoItem'
import VideoAdd from './VideoAdd'

const propTypes = {
  list: React.PropTypes.object.isRequired,
  videoList: React.PropTypes.array.isRequired,
  currentBoard: React.PropTypes.object.isRequired,
  editList: React.PropTypes.func.isRequired,
  deleteList: React.PropTypes.func.isRequired
}

const defaultProps = {
  list: {},
  videoList: [],
  currentBoard: {},
  editList: () => console.log('editList not defined'),
  deleteList: () => console.log('deleteList not defined')
}

class VideoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isEditing: false, name: '', slug: '', error: null }
    this.onNameClick = this.onNameClick.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onPressEnter = this.onPressEnter.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  onNameClick() {
    const name = this.props.list.name
    const slug = this.props.list.slug

    this.setState({ isEditing: true, name, slug })

    // TODO: focus() on <input>
  }

  onInputBlur() {
    this.setState({ isEditing: false })
  }

  onInputChange(event) {
    const name = event.target.value
    const slug = name.trim().toString().toLowerCase().replace(/\s+/g, '-')
    const listExists = _.find(
      this.props.currentBoard.lists,
      list => {return list.slug === slug && list.slug !== this.props.list.slug}
    )
    const error = listExists && 'List exists'

    this.setState({ name, slug, error })
  }

  onPressEnter() {
    const list = this.props.list
    const name = this.state.name.trim()
    const { slug, error } = this.state

    if (name && slug && !error) {
      this.props.editList(list, { name, slug }, this.props.currentBoard)
      this.setState({ isEditing: false })
    }
  }

  onDeleteClick() {
    const list = this.props.list

    if (confirm(`Delete ${list.name}?\nAll videos will be deleted.`)) {
      this.props.deleteList(list, this.props.currentBoard)
    }
  }

  render() {
    const board = this.props.currentBoard
    const list = this.props.list
    const videoList = this.props.videoList

    const VideoHeader = list => {
      if (!this.state.isEditing) {
        return (
          <header className="CardHeader ListHeader">
            <h2
              className="CardTitle ListName"
              onClick={!_.isEmpty(list) && this.onNameClick}>
              {list.name || '📥'}
            </h2>
            {!_.isEmpty(list) &&
              <button className="BtnTrash btn-link" onClick={this.onDeleteClick}>🗑</button>
            }
          </header>
        )
      } else {
        return (
          <header className="CardHeader">
            <input
              className="CardTitle ListName"
              type="text"
              onBlur={this.onInputBlur}
              onChange={this.onInputChange}
              onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
              value={this.state.name}
              ref={input => {this.listNameInput = input}}
            />

            {this.state.error &&
              <small>{this.state.error}</small>
            }
          </header>
        )
      }
    }

    const listScroll = vidoes => {
      return vidoes.map(video => {
        const condition =
          video.board === board.slug &&
          (_.isEmpty(list) ? !video.list : video.list === list.slug) &&
          !video.deleted

        if (condition) {
          return <VideoItem video={video} key={video.data.id} />
        } else {
          return false
        }
      })
    }

    return (
      <article className="Card">
        {VideoHeader(list)}

        <div className="CardScroll">
          {listScroll(videoList)}
        </div>

        <VideoAdd boardSlug={board.slug} listSlug={list.slug} />
      </article>
    )
  }
}

VideoList.propTypes = propTypes
VideoList.defaultProps = defaultProps

export default connect(null, { editList, deleteList })(VideoList)
