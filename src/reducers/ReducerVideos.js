import _ from 'lodash'
import * as types from '../actions/types'

export default function (state = {}, action) {
  switch(action.type) {
    case 'FETCH_VIDEOS_REQUESTED':
      return action.videos || {}

    case 'FETCH_VIDEOS_FULFILLED':
      return action.videos || {}

    case 'IMPORT_STORAGE_REQUESTED':
      return action.videos

    case 'EMPTY_STORAGE_REQUESTED':
      return {}

    case types.EDIT_BOARD:
      const { editingBoard, editingBoardPart } = action.payload
      return state.map(video => {return video.board === editingBoard.slug ?
        { ...video, board: editingBoardPart.slug } : video
      })

    case types.DELETE_BOARD:
      const deletingBoard = action.payload
      return state.map(video => {return video.board === deletingBoard.slug ?
        { ...video, board: null, list: null, deleted: true } : video
      })

    case types.EDIT_LIST:
      const { editingList, editingListPart } = action.payload
      return state.map(video => {return video.list === editingList.slug ?
        { ...video, list: editingListPart.slug } : video
      })

    case types.DELETE_LIST:
      const { deletingList, deletingListCurrentBoard } = action.payload
      return state.map(video => {
        return video.board === deletingListCurrentBoard.slug && video.list === deletingList.slug ?
          { ...video, list: null, deleted: true } : video
      })

    case 'ADD_VIDEO_REQUESTED':
      return { ...state, [action.newVideoKey]: action.video }

    case types.EDIT_VIDEO:
      const { editingVideo, editingVideoPart } = action.payload
      return state.map(video => {return video === editingVideo ?
        { ...video, ...editingVideoPart } : video
      })

    case types.DELETE_VIDEO:
      const deletingVideo = action.payload
      return state.filter(video => {return video !== deletingVideo})

    case types.EMPTY_TRASH:
      return state.filter(video => {return video.deleted !== true})

    default:
      return state
  }
}
