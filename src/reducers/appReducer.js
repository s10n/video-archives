import * as types from '../actions/types'

export default function(state = {}, action) {
  switch (action.type) {
    case types.APP_STATUS:
      return { status: action.status }

    default:
      return state
  }
}
