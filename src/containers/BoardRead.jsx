import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { editBoard, deleteBoard } from '../actions/board'
import { reservedBoardSlug } from '../config/constants'
import './BoardRead.css'
import VideoList from '../components/VideoList'
import ListAdd from '../components/ListAdd'

const propTypes = {
  boards: PropTypes.object.isRequired,
  board: PropTypes.object.isRequired,
  boardKey: PropTypes.string.isRequired,
  videos: PropTypes.object.isRequired,
  editBoard: PropTypes.func.isRequired,
  deleteBoard: PropTypes.func.isRequired
}

const defaultProps = {
  boards: {},
  board: {},
  boardKey: '',
  videos: {},
  editBoard: () => console.warn('editBoard not defined'),
  deleteBoard: () => console.warn('deleteBoard not defined')
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
    const { board } = this.props
    const { title, slug } = board

    this.setState({ isEditing: true, title, slug })
  }

  handleInputBlur() {
    const { board } = this.props
    const { title, slug } = board

    this.setState({ isEditing: false, title, slug, error: null })
  }

  handleInputChange(event) {
    const title = event.target.value
    const slug = title.trim().toString().toLowerCase().replace(/\s+/g, '-')
      .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=|%|\./g, '-').replace(/--+/g, '-')
    const boardExists = _.find(
      this.props.boards,
      board => {return slug === board.slug && slug !== this.props.match.params.boardSlug}
    )
    let error = null

    if (reservedBoardSlug.includes(slug)) {
      error = 'Reserved board title'
    } else if (boardExists) {
      error = 'Board already exists'
    }

    this.setState({ title, slug, error })
  }

  handlePressEnter() {
    const { boardKey, board } = this.props

    const title = this.state.title.trim()
    const { slug, error } = this.state

    if (title && slug && !error) {
      this.props.editBoard(boardKey, { title, slug }, board)
      this.boardTitleInput.blur()
    }
  }

  handleDeleteClick() {
    const { boardKey, board, videos } = this.props

    if (window.confirm(`Delete ${board.title}?\nAll lists and videos will be deleted.`)) {
      this.props.deleteBoard(boardKey, videos, board)
    }
  }

  render() {
    const { boardKey, board, videos } = this.props
    const listsSorted = _.sortBy(board.lists, 'name')
    const videosInbox = _.filter(videos, video => !video.list && !video.deleted)

    return boardKey ? (
      <section className="Page">
        <header className="PageHeader BoardHeader">
          <input
            className="PageTitle BoardTitle h1 borderless-input"
            type="text"
            onFocus={!board.isSyncing && this.handleTitleClick}
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
            {!_.isEmpty(videosInbox) && (
              <div className="VideoWrapper">
                <VideoList
                  videos={videosInbox}
                  board={board}
                  boardKey={boardKey}
                />
              </div>
            )}

            {listsSorted.map(list => {
              const videosSelected = _.filter(videos, video => video.list === list.key && !video.deleted)

              return (
                <div className="VideoWrapper" key={list.key}>
                  <VideoList
                    list={list}
                    listKey={list.key}
                    videos={videosSelected}
                    board={board}
                    boardKey={boardKey}
                  />
                </div>
              )
            })}

            {!board.isSyncing &&
              <div className="VideoWrapper">
                <article className="Card">
                  <header className="CardHeader">
                    <ListAdd boardKey={boardKey} board={board} />
                  </header>
                </article>
              </div>
            }
          </div>
        </main>
      </section>
    ) : (
      <section className="Page">
        <header className="PageHeader BoardHeader">
          <h1 className="PageTitle">Not Found</h1>
        </header>
      </section>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { boards } = state
  const boardKey = _.findKey(boards, ['slug', ownProps.match.params.boardSlug])
  const board = boards[boardKey]
  const videos = _.pickBy(state.videos, ['board', boardKey])
  return { boards, board, boardKey, videos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editBoard, deleteBoard }, dispatch)
}

BoardRead.propTypes = propTypes
BoardRead.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(BoardRead)
