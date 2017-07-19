import { auth, db } from '../config/constants'
import * as types from './types'
import { SAMPLE_BOARDS, SAMPLE_VIDEOS } from '../config/sample'

export function importStorage() {
  const user = auth().currentUser

  return dispatch => {
    dispatch({ type: types.IMPORT_STORAGE, boards: SAMPLE_BOARDS, videos: SAMPLE_VIDEOS })

    if (user) {
      const updates = {
        [`/boards/${user.uid}`]: SAMPLE_BOARDS,
        [`/videos/${user.uid}`]: SAMPLE_VIDEOS
      }

      dispatch({ type: types.APP_STATUS, status: 'App is importing sample' })

      db
        .ref()
        .update(updates)
        .then(() => {
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.IMPORT_STORAGE, boards: {}, videos: {} })
        })
    }
  }
}

export function emptyStorage() {
  const user = auth().currentUser

  return dispatch => {
    dispatch({ type: types.EMPTY_STORAGE })

    if (user) {
      const updates = {
        [`/boards/${user.uid}`]: null,
        [`/videos/${user.uid}`]: null
      }

      dispatch({ type: types.APP_STATUS, status: 'App is emptying storage' })

      db
        .ref()
        .update(updates)
        .then(() => {
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
        })
    }
  }
}

export function pushStorage(props, prevProps) {
  if (JSON.stringify(prevProps.boards) !== JSON.stringify(props.boards)) {
    localStorage.boards = JSON.stringify(props.boards)
  }

  if (JSON.stringify(prevProps.videos) !== JSON.stringify(props.videos)) {
    localStorage.videos = JSON.stringify(props.videos)
  }

  return { type: types.PUSH_STORAGE }
}
