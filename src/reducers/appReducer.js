import types from '../constants/types'

export default function(state = {}, action) {
  switch (action.type) {
    case types.APP_STATUS:
      return { status: action.status }

    default:
      return state
  }
}
