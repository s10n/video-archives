import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { editBoard, deleteBoard } from '../actions/index'
import './BoardRead.css'
import VideoList from '../components/VideoList'
import ListAdd from '../components/ListAdd'

const propTypes = {
  videoStorage: React.PropTypes.object.isRequired,
  editBoard: React.PropTypes.func.isRequired,
  deleteBoard: React.PropTypes.func.isRequired
}

const defaultProps = {
  videoStorage: {},
  editBoard: () => console.log('editBoard not defined'),
  deleteBoard: () => console.log('deleteBoard not defined')
}

class BoardRead extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = { isEditing: false, editingBoardPart: { title: '', slug: '' } }
    this.onTitleClick = this.onTitleClick.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onPressEnter = this.onPressEnter.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  onTitleClick() {
    const currentBoard = _.find(this.props.videoStorage.boards, board => {
      return board.slug === this.props.params.boardSlug
    })

    this.setState({
      isEditing: true,
      editingBoardPart: { ...this.state.editingBoardPart, title: currentBoard.title }
    })

    // this.boardTitleInput.focus() // It doesn't work
  }

  onInputBlur() {
    this.setState({ ...this.state, isEditing: false })
  }

  onInputChange(event) {
    const title = event.target.value
    this.setState({ ...this.state, editingBoardPart: { ...this.state.editingBoardPart, title }})
  }

  onPressEnter() {
    const currentBoard = _.find(this.props.videoStorage.boards, board => {
      return board.slug === this.props.params.boardSlug
    })
    const title = this.state.editingBoardPart.title.trim()
    const slug = title.toString().toLowerCase().replace(/\s+/g, '-')

    if (slug === 'trash') {
      console.log('FAIL: Reserved board title')
    } else if (title && slug) {
      this.props.editBoard(currentBoard, { title, slug })
      this.setState({ ...this.state, isEditing: false })
      this.context.router.push(slug)
    } else {
      console.log('Board title is required')
    }
  }

  onDeleteClick() {
    const currentBoard = _.find(this.props.videoStorage.boards, board => {
      return board.slug === this.props.params.boardSlug
    })

    if (confirm(`Delete ${currentBoard.title}?`)) {
      this.props.deleteBoard(currentBoard)
      this.context.router.push('/')
    }
  }

  render() {
    const currentBoard = _.find(this.props.videoStorage.boards, board => {
      return board.slug === this.props.params.boardSlug
    })

    return (
      <section className="BoardRead">
        {!this.state.isEditing ?
          <header>
            <h1
              className="BoardTitle page-title"
              onClick={this.onTitleClick}>
              {currentBoard.title}
            </h1>
            <button className="btn-link" onClick={this.onDeleteClick}>🗑</button>
          </header>:
          <input
            className="BoardTitleInput page-title"
            type="text"
            onBlur={this.onInputBlur}
            onChange={this.onInputChange}
            onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
            value={this.state.editingBoardPart.title}
            ref={input => {this.boardTitleInput = input}}
          />
        }

        <main className="BoardCanvas page-content">
          <div className="BoardScroll">
            {currentBoard.lists.map(list => {
              return (
                <div className="VideoWrapper" key={list.slug}>
                  <VideoList list={list} videoList={this.props.videoStorage.videos} />
                </div>
              )
            })}

            <div className="VideoWrapper">
              <article className="VideoList card">
                <ListAdd boardSlug={currentBoard.slug} />
              </article>
            </div>
          </div>
        </main>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { videoStorage: state.videoStorage }
}

BoardRead.propTypes = propTypes
BoardRead.defaultProps = defaultProps

export default connect(mapStateToProps, { editBoard, deleteBoard })(BoardRead)
