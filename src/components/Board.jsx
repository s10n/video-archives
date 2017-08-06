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

const ListContainer = ({ children }) =>
  <div className="ListContainer">
    {children}
  </div>

const Board = ({ boards, board, videos }) => {
  const videosInbox = _.filter(videos, video => !video.list && !video.deleted)
  const listsSorted = _.sortBy(board.lists, 'name')

  const listInbox = (
    <ListContainer>
      <List videos={videosInbox} board={board} />
    </ListContainer>
  )

  const listWrapper = list =>
    <ListContainer key={list.key}>
      <List videos={_.filter(videos, video => video.list === list.key)} board={board} list={list} />
    </ListContainer>

  const listAddContainer = (
    <ListContainer>
      <ListAdd board={board} />
    </ListContainer>
  )

  return !_.isEmpty(board)
    ? <Page page="Board" header={<BoardEdit boards={boards} board={board} videos={videos} />}>
        {!_.isEmpty(videosInbox) && listInbox}
        {!_.isEmpty(listsSorted) && listsSorted.map(list => listWrapper(list))}
        {!board.isSyncing && listAddContainer}
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
