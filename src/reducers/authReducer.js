import types from '../constants/types'

const initialState = { authenticated: false, user: {}, error: '' }

export default (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_USER:
      return { ...state, authenticated: true, user: action.user, error: '' }

    case types.UNAUTH_USER:
      return { ...state, authenticated: false, user: {}, error: '' }

    case types.AUTH_ERROR:
      return { ...state, error: action.error }

    default:
      return state
  }
}
