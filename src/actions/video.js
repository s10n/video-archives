import { push } from 'react-router-redux'
import { auth, db } from '../config/constants'
import * as types from './types'

export function fetchVideos() {
  const user = auth().currentUser
  const localVideos = localStorage.videos && JSON.parse(localStorage.videos)

  return dispatch => {
    dispatch({ type: types.FETCH_VIDEOS, videos: localVideos })

    if (user) {
      dispatch({ type: types.APP_STATUS, status: 'App is fetching videos' })

      db
        .ref(`/videos/${user.uid}`)
        .once('value', snap => {
          dispatch({ type: types.FETCH_VIDEOS, videos: snap.val() })
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
        })
    }
  }
}

export function addVideo(video) {
  const user = auth().currentUser
  const videoKey = user ? db.ref(`/videos/${user.uid}`).push().key : Date.now()

  return dispatch => {
    video = { ...video, key: videoKey }
    const syncingVideo = { ...video, isSyncing: true }

    dispatch({ type: types.ADD_VIDEO, videoKey, video: !user ? video : syncingVideo })

    if (user) {
      db
        .ref(`/videos/${user.uid}/${videoKey}`)
        .set(video)
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

export function editVideo(oldVideo, newVideo) {
  const user = auth().currentUser
  const videoKey = oldVideo.key

  return dispatch => {
    const syncingVideo = { ...newVideo, isSyncing: true }

    dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: !user ? newVideo : syncingVideo })

    if (user) {
      db
        .ref(`/videos/${user.uid}/${videoKey}`)
        .update(newVideo)
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

export function deleteVideo(video) {
  const user = auth().currentUser
  const videoKey = video.key

  return dispatch => {
    dispatch({ type: types.DELETE_VIDEO, videoKey })

    if (user) {
      dispatch({ type: types.APP_STATUS, status: `App is deleting video` })

      db
        .ref(`/videos/${user.uid}/${videoKey}`)
        .remove()
        .then(() => {
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.ADD_VIDEO, videoKey, video })
        })
    }
  }
}

export function emptyTrash(videos) {
  const user = auth().currentUser

  return dispatch => {
    dispatch(push('/'))
    videos.forEach(video => {
      dispatch({ type: types.DELETE_VIDEO, videoKey: video.key })
    })

    if (user) {
      let updates = {}

      videos.forEach(video => {
        updates[`/videos/${user.uid}/${video.key}`] = null
      })

      dispatch({ type: types.APP_STATUS, status: `App is deleting video` })

      db
        .ref()
        .update(updates)
        .then(() => {
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          videos.forEach(video => {
            dispatch({ type: types.ADD_VIDEO, videoKey: video.key, video })
          })
          dispatch(push('Trash'))
        })
    }
  }
}
