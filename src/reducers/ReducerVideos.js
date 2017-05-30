import dotProp from 'dot-prop-immutable'
import * as types from '../actions/types'

export default function (state = {}, action) {
  switch(action.type) {
    case types.FETCH_VIDEOS:
      return action.videos || {}

    case 'FETCH_VIDEOS_FULFILLED':
      return action.videos || {}

    case types.IMPORT_STORAGE:
      return action.videos

    case types.EMPTY_STORAGE:
      return {}

    case types.ADD_VIDEO:
      return { ...state, [action.newVideoKey]: action.video }

    case types.EDIT_VIDEO:
      return dotProp.merge(state, action.videoKey, action.newVideo)

    case types.DELETE_VIDEO:
      return dotProp.delete(state, action.videoKey)

    default:
      return state
  }
}
