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
      const newBoard = action.payload

      if (!_.find(state.boards, o => {return o.slug === newBoard.slug})) {
        return {
          boards: [ ...state.boards, { name: newBoard.name, slug: newBoard.slug, lists: [] } ],
          videos: state.videos
        }
      } else {
        console.log('FAIL: Board exists')
        return state
      }

    case ADD_LIST:
      const { listName, currentBoardSlug } = action.payload
      const currentBoard = _.find(state.boards, o => {return o.slug === currentBoardSlug})

      if (currentBoard.lists.indexOf(listName) === -1) {
        return {
          // TODO: optimize
          boards: state.boards.map(board => {
            if (board === currentBoard) {
              return { name: board.name, slug: board.slug, lists: [ ...board.lists, listName ] }
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

      return {
        boards: state.boards,
        videos: [ ...state.videos, videoItem ]
      }

    default:
      return state
  }
}
