import { push } from 'react-router-redux'
import { auth, db } from '../config/constants'
import * as types from './types'

export function fetchVideos() {
  return dispatch => {
    const user = auth().currentUser
    const localVideos = localStorage.videos && JSON.parse(localStorage.videos)

    dispatch({ type: types.FETCH_VIDEOS, videos: localVideos })

    if (user) {
      dispatch({ type: types.APP_STATUS, status: 'App is fetching videos' })

      db.ref(`/videos/${user.uid}`)
        .once('value', snap => {
          dispatch({ type: 'FETCH_VIDEOS_FULFILLED', videos: snap.val() })
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
        })
    }
  }
}

export function addVideo(video) {
  return dispatch => {
    const user = auth().currentUser
    const newVideoKey = user ? db.ref(`/videos/${user.uid}`).push().key : Date.now()
    video = { ...video, key: newVideoKey }
    const syncingVideo = { ...video, isSyncing: true }

    dispatch({ type: types.ADD_VIDEO, newVideoKey, video: !user ? video : syncingVideo })

    if (user) {
      const videoKey = newVideoKey

      db.ref(`/videos/${user.uid}/${newVideoKey}`).set(video)
        .then(() => {
          const syncedVideo = { ...video, isSyncing: false }
          dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: syncedVideo })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.DELETE_VIDEO, videoKey })
        })
    }
  }
}

export function editVideo(videoKey, newVideo, oldVideo) {
  return dispatch => {
    const user = auth().currentUser
    const syncingVideo = { ...newVideo, isSyncing: true }

    dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: !user ? newVideo : syncingVideo })

    if (user) {
      db.ref(`/videos/${user.uid}/${videoKey}`).update(newVideo)
        .then(() => {
          const syncedVideo = { ...newVideo, isSyncing: false }
          dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: syncedVideo })
        })
        .catch(error => {
          const syncedVideo = { ...oldVideo, isSyncing: false }
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: syncedVideo })
        })
    }
  }
}

export function deleteVideo(videoKey, video) {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.DELETE_VIDEO, videoKey })

    if (user) {
      dispatch({ type: types.APP_STATUS, status: `App is deleting video` })

      db.ref(`/videos/${user.uid}/${videoKey}`).remove()
        .then(() => {
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.ADD_VIDEO, newVideoKey: videoKey, video })
        })
    }
  }
}

export function emptyTrash(videos) {
  return dispatch => {
    const user = auth().currentUser

    dispatch(push('/'))
    Object.keys(videos).forEach(videoKey => {
      dispatch({ type: types.DELETE_VIDEO, videoKey })
    })

    if (user) {
      let updates = {}

      Object.keys(videos).forEach(videoKey => {
        updates[`/videos/${user.uid}/${videoKey}`] = null
      })

      dispatch({ type: types.APP_STATUS, status: `App is deleting video` })

      db.ref().update(updates)
        .then(() => {
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          Object.keys(videos).forEach(videoKey => {
            dispatch({ type: types.ADD_VIDEO, newVideoKey: videoKey, video: videos[videoKey] })
          })
          dispatch(push('Trash'))
        })
    }
  }
}
