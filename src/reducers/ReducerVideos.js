import _ from 'lodash'
import {
  FETCH_STORAGE,

  ADD_BOARD,
  EDIT_BOARD,
  DELETE_BOARD,

  ADD_LIST,
  EDIT_LIST,
  DELETE_LIST,

  ADD_VIDEO,
  EDIT_VIDEO,
  DELETE_VIDEO,

  EMPTY_TRASH
} from '../actions/index'

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
          boards: [ ...state.boards, { title: newBoard.title, slug: newBoard.slug, lists: [] } ]
        }
      } else {
        console.log('FAIL: Board exists')
        return state
      }

    case EDIT_BOARD:
      const { editingBoard, editingBoardPart } = action.payload

      return {
        ...state,
        boards: state.boards.map(board => {
          if (board === editingBoard) {
            return Object.assign({}, board, editingBoardPart)
          } else {
            return board
          }
        })
      }

    case DELETE_BOARD:
      const deletingBoard = action.payload

      return {
        ...state,
        boards: state.boards.filter(board => {return board !== deletingBoard})
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
              return { title: board.title, slug: board.slug, lists: [ ...board.lists, newList ] }
            } else {
              return board
            }
          })
        }
      } else {
        console.log('FAIL: List exists')
        return state
      }

    case EDIT_LIST:
      console.log('Editing board')
      return state

    case DELETE_LIST:
      console.log('Deleting board')
      return state

    case ADD_VIDEO:
      const newVideo = action.payload

      return {
        ...state,
        videos: [ ...state.videos, newVideo ]
      }

    case EDIT_VIDEO:
      const { editingVideo, editingVideoPart } = action.payload

      return {
        ...state,
        videos: state.videos.map(video => {
          if (video === editingVideo) {
            return Object.assign({}, video, editingVideoPart)
          } else {
            return video
          }
        })
      }

    case DELETE_VIDEO:
      const deletingVideo = action.payload

      return {
        ...state,
        videos: state.videos.filter(video => {return video !== deletingVideo})
      }

    case EMPTY_TRASH:
      return {
        ...state,
        videos: state.videos.filter(video => {return video.deleted !== true})
      }

    default:
      return state
  }
}
