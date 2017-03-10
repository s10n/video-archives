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
    this.state = { isEditing: false, editingListPart: { name: '', slug: '' } }
    this.onNameClick = this.onNameClick.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onPressEnter = this.onPressEnter.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  onNameClick() {
    this.setState({
      isEditing: true,
      editingListPart: { ...this.state.editingListPart, name: this.props.list.name }
    })

    // TODO: focus() on <input>
  }

  onInputBlur() {
    this.setState({ isEditing: false })
  }

  onInputChange(event) {
    const name = event.target.value
    this.setState({ editingListPart: { ...this.state.editingListPart, name }})
  }

  onPressEnter() {
    const name = this.state.editingListPart.name.trim()
    const slug = name.toString().toLowerCase().replace(/\s+/g, '-')

    if (name && slug) {
      this.props.editList(this.props.list, { name, slug }, this.props.currentBoard)
      this.setState({ isEditing: false })
    } else {
      console.log('List name is required')
    }
  }

  onDeleteClick() {
    if (confirm(`Delete ${this.props.list.name}?`)) {
      this.props.deleteList(this.props.list, this.props.currentBoard)
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
              value={this.state.editingListPart.name}
              ref={input => {this.listNameInput = input}}
            />
          </header>
        )
      }
    }

    const listScroll = vidoes => {
      return vidoes.map(video => {
        const condition = video.board === board.slug &&
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
