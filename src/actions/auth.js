import { push } from 'react-router-redux'
import { auth } from '../constants/api'
import types from '../constants/types'
import { fetchBoards } from './board'
import { fetchVideos } from './video'
import { emptyStorage } from './storage'

export function signupUser({ email, password }) {
  return dispatch => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        dispatch({ type: types.AUTH_USER, uid: response.uid })
        dispatch(push('/'))
      })
      .catch(error => {
        dispatch(authError(error.message))
      })
  }
}

export function signinUser({ email, password }) {
  return dispatch => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        dispatch({ type: types.AUTH_USER, uid: response.uid })
        dispatch(push('/'))
        dispatch(fetchBoards())
        dispatch(fetchVideos())
      })
      .catch(error => {
        dispatch(authError(error.message))
      })
  }
}

export function signoutUser() {
  return dispatch => {
    auth()
      .signOut()
      .then(response => {
        dispatch({ type: types.UNAUTH_USER })
        dispatch(emptyStorage())
      })
      .catch(error => {
        dispatch(authError(error.message))
      })
  }
}

function authError(error) {
  return { type: types.AUTH_ERROR, error }
}
