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

    // this.listNameInput.focus() // It doesn't work
  }

  onInputBlur() {
    this.setState({ ...this.state, isEditing: false })
  }

  onInputChange(event) {
    const name = event.target.value
    this.setState({ ...this.state, editingListPart: { ...this.state.editingListPart, name }})
  }

  onPressEnter() {
    const name = this.state.editingListPart.name.trim()
    const slug = name.toString().toLowerCase().replace(/\s+/g, '-')

    if (name && slug) {
      this.props.editList(this.props.list, { name, slug }, this.props.currentBoard)
      this.setState({ ...this.state, isEditing: false })
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
    const listName = this.props.list.name
    const mapToComponent = vidoes => {
      return vidoes.map(video => {
        if (video.list === listName && !video.deleted) {
          return <VideoItem video={video} key={video.data.id} />
        } else {
          return false
        }
      })
    }

    return (
      <article className="VideoList card">
        {!this.state.isEditing ?
          <header>
            <h2
              className="ListName card-title"
              onClick={this.onNameClick}>
              {listName}
            </h2>
            <button className="btn-link" onClick={this.onDeleteClick}>🗑</button>
          </header> :
          <input
            className="ListNameInput card-title"
            type="text"
            onBlur={this.onInputBlur}
            onChange={this.onInputChange}
            onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
            value={this.state.editingListPart.name}
            ref={input => {this.listNameInput = input}}
          />
        }


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

export default connect(null, { editList, deleteList })(VideoList)
