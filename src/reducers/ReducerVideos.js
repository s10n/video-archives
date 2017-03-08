import _ from 'lodash'
import { FETCH_STORAGE, ADD_BOARD, ADD_LIST, ADD_VIDEO, EDIT_VIDEO } from '../actions/index'

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

      if (!_.find(state.boards, board => {return board.slug === newBoard.slug})) {
        return {
          ...state,
          boards: [ ...state.boards, { name: newBoard.name, slug: newBoard.slug, lists: [] } ]
        }
      } else {
        console.log('FAIL: Board exists')
        return state
      }

    case ADD_LIST:
      const { newList, boardSlug } = action.payload
      const currentBoard = _.find(state.boards, board => {return board.slug === boardSlug})

      if (!_.find(currentBoard.lists, list => {return list.slug === newList.slug})) {
        return {
          // TODO: optimize
          ...state,
          boards: state.boards.map(board => {
            if (board === currentBoard) {
              return { name: board.name, slug: board.slug, lists: [ ...board.lists, newList ] }
            } else {
              return board
            }
          })
        }
      } else {
        console.log('FAIL: List exists')
        return state
      }

    case ADD_VIDEO:
      const newVideo = action.payload

      return {
        ...state,
        videos: [ ...state.videos, newVideo ]
      }

    case EDIT_VIDEO:
      const editingVideo = action.payload

      return {
        ...state,
        videos: state.videos.map(video => {
          if (video === editingVideo) {
            return { ...video, deleted: true }
          } else {
            return video
          }
        })
      }

    default:
      return state
  }
}
