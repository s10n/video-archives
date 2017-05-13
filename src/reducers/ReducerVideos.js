import _ from 'lodash'
import dotProp from 'dot-prop-immutable'
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

    case 'EDIT_VIDEO_REQUESTED':
      return dotProp.merge(state, action.videoKey, action.newVideo)

    case types.DELETE_VIDEO:
      const deletingVideo = action.payload
      return state.filter(video => {return video !== deletingVideo})

    case types.EMPTY_TRASH:
      return state.filter(video => {return video.deleted !== true})

    default:
      return state
  }
}
