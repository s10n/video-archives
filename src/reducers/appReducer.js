import types from '../constants/types'

const initialState = { status: '' }

export default (state = initialState, action) => {
  switch (action.type) {
    case types.APP_STATUS:
      return { status: action.status }

    default:
      return state
  }
}
