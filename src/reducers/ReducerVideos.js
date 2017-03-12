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
      return action.payload || INITIAL_STATE

    case IMPORT_STORAGE:
      return SAMPLE_STORAGE

    case EMPTY_STORAGE:
      return INITIAL_STATE

    case ADD_BOARD:
      const addingBoard = action.payload

      return {
        ...state,
        boards: [ ...state.boards, { title: addingBoard.title, slug: addingBoard.slug, lists: [] } ]
      }

    case EDIT_BOARD:
      const { editingBoard, editingBoardPart } = action.payload

      return {
        ...state,
        boards: state.boards.map(board => {return board === editingBoard ?
          Object.assign({}, board, editingBoardPart) : board
        }),
        videos: state.videos.map(video => {return video.board === editingBoard.slug ?
          Object.assign({}, video, { board: editingBoardPart.slug }) : video
        })
      }

    case DELETE_BOARD:
      const deletingBoard = action.payload

      return {
        ...state,
        boards: state.boards.filter(board => {return board !== deletingBoard}),
        videos: state.videos.map(video => {return video.board === deletingBoard.slug ?
          Object.assign({}, video, { board: null, list: null, deleted: true }) : video
        })
      }

    case ADD_LIST:
      const { addingList, addingListCurrentBoard } = action.payload

      return {
        ...state,
        boards: state.boards.map(board => {return board === addingListCurrentBoard ?
          { ...board, lists: [ ...board.lists, addingList ] } : board
        })
      }

    case EDIT_LIST:
      const { editingList, editingListPart, editingListCurrentBoard } = action.payload

      return {
        ...state,
        boards: state.boards.map(board => {return board === editingListCurrentBoard ?
          { ...board,
            lists: board.lists.map(list => {return list === editingList ? editingListPart : list})
          } : board
        }),
        videos: state.videos.map(video => {return video.list === editingList.slug ?
          Object.assign({}, video, { list: editingListPart.slug }) : video
        })
      }

    case DELETE_LIST:
      const { deletingList, deletingListCurrentBoard } = action.payload

      return {
        ...state,
        boards: state.boards.map(board => {return board === deletingListCurrentBoard ?
          { ...board, lists: board.lists.filter(list => {return list !== deletingList}) } :
          board
        }),
        videos: state.videos.map(video => {
          return video.board === deletingListCurrentBoard.slug && video.list === deletingList.slug ?
            Object.assign({}, video, { list: null, deleted: true }) : video
        })
      }

    case ADD_VIDEO:
      const addingVideo = action.payload

      return {
        ...state,
        videos: [ ...state.videos, addingVideo ]
      }

    case EDIT_VIDEO:
      const { editingVideo, editingVideoPart } = action.payload

      return {
        ...state,
        videos: state.videos.map(video => {return video === editingVideo ?
          Object.assign({}, video, editingVideoPart) : video
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
