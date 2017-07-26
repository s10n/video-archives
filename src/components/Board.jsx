import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './Board.css'
import Page from './Page'
import BoardEdit from './BoardEdit'
import List from './List'
import ListAdd from './ListAdd'
import NotFound from './NotFound'

const propTypes = {
  boards: PropTypes.object.isRequired,
  board: PropTypes.object.isRequired,
  videos: PropTypes.array.isRequired
}

const Board = ({ boards, board, videos }) => {
  const videosInbox = _.filter(videos, video => !video.list && !video.deleted)
  const listsSorted = _.sortBy(board.lists, 'name')

  const ListContainer = ({ children }) => {
    return (
      <div className="ListContainer">
        {children}
      </div>
    )
  }

  const ListInbox = () => {
    return (
      <ListContainer>
        <List videos={videosInbox} board={board} />
      </ListContainer>
    )
  }

  const ListWrapper = ({ list }) => {
    const videosList = _.filter(videos, video => video.list === list.key)

    return (
      <ListContainer>
        <List videos={videosList} board={board} list={list} />
      </ListContainer>
    )
  }

  const ListAddContainer = () => {
    return (
      <ListContainer>
        <ListAdd board={board} />
      </ListContainer>
    )
  }

  return !_.isEmpty(board)
    ? <Page page="Board" header={<BoardEdit boards={boards} board={board} videos={videos} />}>
        {!_.isEmpty(videosInbox) && <ListInbox />}

        {!_.isEmpty(listsSorted) &&
          listsSorted.map(list => <ListWrapper list={list} key={list.key} />)}

        {!board.isSyncing && <ListAddContainer />}
      </Page>
    : <NotFound />
}

Board.propTypes = propTypes

function mapStateToProps(state, ownProps) {
  const { boards } = state
  const board = _.find(boards, ['slug', ownProps.match.params.boardSlug]) || {}
  const videos = _.filter(state.videos, ['board', board.key])
  return { boards, board, videos }
}

export default connect(mapStateToProps)(Board)
