import { push } from 'react-router-redux'
import { auth, db } from '../config/constants'
import * as types from './types'

export function fetchVideos() {
  return dispatch => {
    const user = auth().currentUser
    const localVideos = localStorage.videos && JSON.parse(localStorage.videos)

    dispatch({ type: types.FETCH_VIDEOS, videos: localVideos })

    if (user) {
      db.ref(`/videos/${user.uid}`)
        .once('value', snap => { dispatch({ type: 'FETCH_VIDEOS_FULFILLED', videos: snap.val() }) })
        .catch(error => { dispatch({ type: 'FETCH_VIDEOS_REJECTED' }) })
    }
  }
}

export function addVideo(video) {
  return dispatch => {
    const user = auth().currentUser
    const newVideoKey = user ? db.ref(`/videos/${user.uid}`).push().key : Date.now()

    dispatch({ type: types.ADD_VIDEO, newVideoKey, video })

    if (user) {
      db.ref(`/videos/${user.uid}/${newVideoKey}`).set(video)
        .then(() => { dispatch({ type: 'ADD_VIDEO_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'ADD_VIDEO_REJECTED' }) })
    }
  }
}

export function editVideo(videoKey, newVideo) {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo })

    if (user) {
      db.ref(`/videos/${user.uid}/${videoKey}`).update(newVideo)
        .then(() => { dispatch({ type: 'EDIT_VIDEO_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'EDIT_VIDEO_REJECTED' }) })
    }
  }
}

export function deleteVideo(videoKey) {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.DELETE_VIDEO, videoKey })

    if (user) {
      db.ref(`/videos/${user.uid}/${videoKey}`).remove()
        .then(() => { dispatch({ type: 'DELETE_VIDEO_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'DELETE_VIDEO_REJECTED' }) })
    }
  }
}

export function emptyTrash(videos) {
  return dispatch => {
    const user = auth().currentUser

    videos.map(videoKey => {
      dispatch(deleteVideo(videoKey))
      return false
    })

    dispatch({ type: types.EMPTY_TRASH })

    if (user) {
      let updates = {}

      videos.map(videoKey => {
        updates[`/videos/${user.uid}/${videoKey}`] = null
        return false
      })

      db.ref().update(updates)
        .then(() => {
          dispatch({ type: 'EMPTY_TRASH_FULFILLED' })
          dispatch(push('/'))
        })
        .catch(error => { dispatch({ type: 'EMPTY_TRASH_REJECTED' }) })
    }
  }
}
