import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editBoard, deleteBoard } from '../actions'
import './BoardRead.css'
import VideoList from '../components/VideoList'
import ListAdd from '../components/ListAdd'

const propTypes = {
  boards: React.PropTypes.object.isRequired,
  videos: React.PropTypes.object.isRequired,
  editBoard: React.PropTypes.func.isRequired,
  deleteBoard: React.PropTypes.func.isRequired
}

const defaultProps = {
  boards: {},
  videos: {},
  editBoard: () => console.warn('editBoard not defined'),
  deleteBoard: () => console.warn('deleteBoard not defined')
}

const contextTypes = {
  router: React.PropTypes.object
}

class BoardRead extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isEditing: false, title: '', slug: '', error: null }
    this.handleTitleClick = this.handleTitleClick.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePressEnter = this.handlePressEnter.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleTitleClick() {
    const currentBoard = _.find(this.props.boards, ['slug', this.props.params.boardSlug])
    const { title, slug } = currentBoard

    this.setState({ isEditing: true, title, slug })
  }

  handleInputBlur() {
    const currentBoard = _.find(this.props.boards, ['slug', this.props.params.boardSlug])
    const { title, slug } = currentBoard

    this.setState({ isEditing: false, title, slug, error: null })
  }

  handleInputChange(event) {
    const title = event.target.value
    const slug = title.trim().toString().toLowerCase().replace(/\s+/g, '-')
      .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=/g, '-').replace(/--+/g, '-')
    const boardExists = _.find(
      this.props.boards,
      board => {return slug === board.slug && slug !== this.props.params.boardSlug}
    )
    let error = null

    if (slug === 'trash') {
      error = 'Reserved board title'
    } else if (boardExists) {
      error = 'Board already exists'
    }

    this.setState({ title, slug, error })
  }

  handlePressEnter() {
    const currentBoard = _.find(this.props.boards, ['slug', this.props.params.boardSlug])
    const title = this.state.title.trim()
    const { slug, error } = this.state

    if (title && slug && !error) {
      this.props.editBoard(currentBoard, { title, slug })
      this.context.router.push(slug)
      this.boardTitleInput.blur()
    }
  }

  handleDeleteClick() {
    const currentBoard = _.find(this.props.boards, ['slug', this.props.params.boardSlug])

    if (confirm(`Delete ${currentBoard.title}?\nAll lists and videos will be deleted.`)) {
      this.props.deleteBoard(currentBoard)
      this.context.router.push('/')
    }
  }

  render() {
    const boardKey = _.findKey(this.props.boards, ['slug', this.props.params.boardSlug])
    const board = this.props.boards[boardKey]

    return (
      <section className="Page">
        <header className="PageHeader BoardHeader">
          <input
            className="PageTitle BoardTitle h1 borderless-input"
            type="text"
            onFocus={this.handleTitleClick}
            onBlur={this.handleInputBlur}
            onChange={this.handleInputChange}
            onKeyPress={event => {(event.key === 'Enter') && this.handlePressEnter()}}
            value={!this.state.isEditing ? board.title : this.state.title}
            ref={input => {this.boardTitleInput = input}}
          />

          <button className="BtnTrash btn-link" onClick={this.handleDeleteClick}>🗑</button>
          {this.state.error &&
            <small>{this.state.error}</small>
          }
        </header>

        <main className="PageContent">
          <div className="PageContentInner BoardScroll">
            {
              _.find(
                this.props.videos,
                video => {
                  return video.board === board.slug && !video.list && !video.deleted
                }
              ) &&
              <div className="VideoWrapper">
                <VideoList
                  videoList={this.props.videos}
                  board={board}
                />
              </div>
            }

            {board.lists && Object.keys(board.lists).map(key =>
              <div className="VideoWrapper" key={key}>
                <VideoList
                  list={board.lists[key]}
                  videoList={this.props.videos}
                  board={board}
                />
              </div>
            )}

            <div className="VideoWrapper">
              <article className="Card">
                <header className="CardHeader">
                  <ListAdd boardKey={boardKey} board={board} />
                </header>
              </article>
            </div>
          </div>
        </main>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { boards: state.boards, videos: state.videos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editBoard, deleteBoard }, dispatch)
}

BoardRead.propTypes = propTypes
BoardRead.defaultProps = defaultProps
BoardRead.contextTypes = contextTypes

export default connect(mapStateToProps, mapDispatchToProps)(BoardRead)
