import { push } from 'react-router-redux'
import { auth } from '../constants/api'
import types from '../constants/types'
import { fetchBoards } from './board'
import { fetchVideos } from './video'
import { emptyStorage } from './storage'

export const signupUser = ({ email, password }) => dispatch => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      dispatch({ type: types.AUTH_USER, user })
      dispatch(push('/'))
    })
    .catch(error => {
      dispatch(authError(error.message))
    })
}

export const signinUser = ({ email, password }) => dispatch => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      dispatch({ type: types.AUTH_USER, user })
      dispatch(push('/'))
      dispatch(fetchBoards())
      dispatch(fetchVideos())
    })
    .catch(error => {
      dispatch(authError(error.message))
    })
}

export const signoutUser = () => dispatch => {
  auth()
    .signOut()
    .then(user => {
      dispatch({ type: types.UNAUTH_USER })
      dispatch(emptyStorage())
    })
    .catch(error => {
      dispatch(authError(error.message))
    })
}

const authError = error => ({ type: types.AUTH_ERROR, error })
