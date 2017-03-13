import _ from 'lodash'
import * as types from '../actions/types'
import { SAMPLE_STORAGE } from './SampleStorage'

const initialState = { boards: [], videos: [] }

export default function (state = initialState, action) {
  switch(action.type) {
    case types.FETCH_STORAGE:
      return action.payload || initialState

    case types.IMPORT_STORAGE:
      return SAMPLE_STORAGE

    case types.EMPTY_STORAGE:
      return initialState

    case types.ADD_BOARD:
      const addingBoard = action.payload

      return {
        ...state,
        boards: [ ...state.boards, { title: addingBoard.title, slug: addingBoard.slug, lists: [] } ]
      }

    case types.EDIT_BOARD:
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

    case types.DELETE_BOARD:
      const deletingBoard = action.payload

      return {
        ...state,
        boards: state.boards.filter(board => {return board !== deletingBoard}),
        videos: state.videos.map(video => {return video.board === deletingBoard.slug ?
          Object.assign({}, video, { board: null, list: null, deleted: true }) : video
        })
      }

    case types.ADD_LIST:
      const { addingList, addingListCurrentBoard } = action.payload

      return {
        ...state,
        boards: state.boards.map(board => {return board === addingListCurrentBoard ?
          { ...board, lists: [ ...board.lists, addingList ] } : board
        })
      }

    case types.EDIT_LIST:
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

    case types.DELETE_LIST:
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

    case types.ADD_VIDEO:
      const addingVideo = action.payload

      return {
        ...state,
        videos: [ ...state.videos, addingVideo ]
      }

    case types.EDIT_VIDEO:
      const { editingVideo, editingVideoPart } = action.payload

      return {
        ...state,
        videos: state.videos.map(video => {return video === editingVideo ?
          Object.assign({}, video, editingVideoPart) : video
        })
      }

    case types.DELETE_VIDEO:
      const deletingVideo = action.payload

      return {
        ...state,
        videos: state.videos.filter(video => {return video !== deletingVideo})
      }

    case types.EMPTY_TRASH:
      return {
        ...state,
        videos: state.videos.filter(video => {return video.deleted !== true})
      }

    default:
      return state
  }
}
