import { auth, db } from '../config/constants'
import * as types from './types'
import { SAMPLE_BOARDS, SAMPLE_VIDEOS } from '../SampleStorage'

export function importStorage() {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.IMPORT_STORAGE, boards: SAMPLE_BOARDS, videos: SAMPLE_VIDEOS })

    if (user) {
      const updates = {
        [`/boards/${user.uid}`]: SAMPLE_BOARDS,
        [`/videos/${user.uid}`]: SAMPLE_VIDEOS
      }

      db.ref().update(updates)
        .then(() => { dispatch({ type: 'IMPORT_STORAGE_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'IMPORT_STORAGE_REJECTED' }) })
    }
  }
}

export function emptyStorage() {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.EMPTY_STORAGE })

    if (user) {
      const updates = {
        [`/boards/${user.uid}`]: null,
        [`/videos/${user.uid}`]: null
      }

      db.ref().update(updates)
        .then(() => { dispatch({ type: 'EMPTY_STORAGE_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'EMPTY_STORAGE_REJECTED' }) })
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
