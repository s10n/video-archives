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

    case 'ADD_VIDEO_REQUESTED':
      return { ...state, [action.newVideoKey]: action.video }

    case 'EDIT_VIDEO_REQUESTED':
      return dotProp.merge(state, action.videoKey, action.newVideo)

    case 'DELETE_VIDEO_REQUESTED':
      return dotProp.delete(state, action.videoKey)

    case types.EMPTY_TRASH:
      return state.filter(video => {return video.deleted !== true})

    default:
      return state
  }
}
