import * as types from '../actions/types'

export default function(state = {}, action) {
  switch(action.type) {
    case types.FETCH_BOARDS:
      return { isBoardsFetching: action.isBoardsFetching }

    case types.FETCH_BOARDS_REJECTED:
      return { error: action.error }

    default:
      return state
  }
}
