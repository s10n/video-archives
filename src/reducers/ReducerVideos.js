import _ from 'lodash'
import {
  FETCH_STORAGE,
  IMPORT_STORAGE,
  EMPTY_STORAGE,

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
import { SAMPLE_STORAGE } from './SampleStorage'

const INITIAL_STATE = { boards: [], videos: [] }

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_STORAGE:
      if (action.payload) {
        return action.payload
      } else {
        return INITIAL_STATE
      }

    case IMPORT_STORAGE:
      return SAMPLE_STORAGE

    case EMPTY_STORAGE:
      return INITIAL_STATE

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

      if (!_.find(state.boards, board => {return board.slug === editingBoardPart.slug})) {
        return {
          ...state,
          boards: state.boards.map(board => {
            if (board === editingBoard) {
              return Object.assign({}, board, editingBoardPart)
            } else {
              return board
            }
          }),
          videos: state.videos.map(video => {
            if (video.board === editingBoard.slug) {
              return Object.assign({}, video, { board: editingBoardPart.slug })
            } else {
              return video
            }
          })
        }
      } else {
        console.log('FAIL: Board exists')
        return state
      }

    case DELETE_BOARD:
      const deletingBoard = action.payload

      return {
        ...state,
        boards: state.boards.filter(board => {return board !== deletingBoard}),
        videos: state.videos.map(video => {
          if (video.board === deletingBoard.slug) {
            return Object.assign({}, video, { board: null, list: null, deleted: true })
          } else {
            return video
          }
        })
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
      const { editingList, editingListPart, editingListCurrentBoard } = action.payload

      if (!_.find(editingListCurrentBoard.lists, list => {return list.slug === editingListPart.slug})) {
        return {
          ...state,
          boards: state.boards.map(board => {
            if (board === editingListCurrentBoard) {
              return {
                ...board,
                lists: board.lists.map(list => {return list === editingList ? editingListPart : list})
              }
            } else {
              return board
            }
          }),
          videos: state.videos.map(video => {
            if (video.list === editingList.slug) {
              return Object.assign({}, video, { list: editingListPart.slug })
            } else {
              return video
            }
          })
        }
      } else {
        console.log('FAIL: List exists')
        return state
      }

    case DELETE_LIST:
      const { deletingList, deletingListCurrentBoard } = action.payload

      return {
        ...state,
        boards: state.boards.map(board => {
          if (board === deletingListCurrentBoard) {
            return { ...board, lists: board.lists.filter(list => {return list !== deletingList}) }
          } else {
            return board
          }
        }),
        videos: state.videos.map(video => {
          if (video.board === deletingListCurrentBoard.slug && video.list === deletingList.slug) {
            return Object.assign({}, video, { list: null, deleted: true })
          } else {
            return video
          }
        })
      }

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
