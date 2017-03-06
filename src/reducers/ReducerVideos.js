import _ from 'lodash'
import { FETCH_STORAGE, ADD_BOARD, ADD_LIST, ADD_VIDEO } from '../actions/index'

const INITIAL_STATE = { boards: [], videos: [] }

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_STORAGE:
      if (action.payload) {
        return action.payload
      } else {
        return INITIAL_STATE
      }

    case ADD_BOARD:
      const boardName = action.payload

      if (!_.find(state.boards, o => {return o.name === boardName})) {
        return {
          boards: [ ...state.boards, { name: boardName, lists: [] } ],
          videos: state.videos
        }
      } else {
        console.log('FAIL: Board exists')
        return state
      }

    case ADD_LIST:
      const { listName, currentBoardName } = action.payload
      const currentBoard = _.find(state.boards, o => {return o.name === currentBoardName})

      if (currentBoard.lists.indexOf(listName) === -1) {
        return {
          // TODO: optimize
          boards: state.boards.map(board => {
            if (board === currentBoard) {
              return { name: board.name, lists: [ ...board.lists, listName ] }
            } else {
              return board
            }
          }),
          videos: state.videos
        }
      } else {
        console.log('FAIL: List exists')
        return state
      }

    case ADD_VIDEO:
      const videoItem = action.payload

      if (!_.find(state.videos, o => {return o.videoData.id === videoItem.videoData.id})) {
        return {
          boards: state.boards,
          videos: [ ...state.videos, videoItem ]
        }
      } else {
        console.log('FAIL: Video exists')
        return state
      }

    default:
      return state
  }
}
