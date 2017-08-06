import types from '../constants/types'

export default function(state = {}, action) {
  switch (action.type) {
    case types.AUTH_USER:
      return { ...state, authenticated: true, uid: action.uid, error: '' }

    case types.UNAUTH_USER:
      return { ...state, authenticated: false, uid: null }

    case types.AUTH_ERROR:
      return { ...state, error: action.error }

    default:
      return state
  }
}
