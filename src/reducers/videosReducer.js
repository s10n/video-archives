import dotProp from 'dot-prop-immutable'
import * as types from '../actions/types'

export default function(state = {}, action) {
  switch (action.type) {
    case types.FETCH_VIDEOS:
      return action.videos || {}

    case types.IMPORT_STORAGE:
      return action.videos

    case types.EMPTY_STORAGE:
      return {}

    case types.ADD_VIDEO:
      return dotProp.set(state, action.videoKey, action.video)

    case types.EDIT_VIDEO:
      return dotProp.merge(state, action.videoKey, action.newVideo)

    case types.DELETE_VIDEO:
      return dotProp.delete(state, action.videoKey)

    default:
      return state
  }
}
