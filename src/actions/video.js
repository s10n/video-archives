import { push } from 'react-router-redux'
import { db } from '../constants/api'
import types from '../constants/types'

export const fetchVideos = () => (dispatch, getState) => {
  const localVideos = JSON.parse(localStorage.getItem('videos'))
  const { authenticated, user } = getState().auth
  const auth = authenticated
  dispatch({ type: types.FETCH_VIDEOS, videos: localVideos })

  if (auth) {
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

export const addVideo = video => (dispatch, getState) => {
  const { authenticated, user } = getState().auth
  const auth = authenticated
  const videoKey = auth ? db.ref(`/videos/${user.uid}`).push().key : Date.now()
  video = { ...video, key: videoKey }
  const syncingVideo = { ...video, isSyncing: true }

  dispatch({ type: types.ADD_VIDEO, videoKey, video: !auth ? video : syncingVideo })

  if (auth) {
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

export const editVideo = (oldVideo, newVideo) => (dispatch, getState) => {
  const videoKey = oldVideo.key
  const { authenticated, user } = getState().auth
  const auth = authenticated
  const syncingVideo = { ...newVideo, isSyncing: true }

  dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: !auth ? newVideo : syncingVideo })

  if (auth) {
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

export const deleteVideo = video => (dispatch, getState) => {
  const videoKey = video.key
  const { authenticated, user } = getState().auth
  const auth = authenticated
  dispatch({ type: types.DELETE_VIDEO, videoKey })

  if (auth) {
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

export const emptyTrash = videos => (dispatch, getState) => {
  const { authenticated, user } = getState().auth
  const auth = authenticated
  dispatch(push('/'))
  videos.forEach(video => {
    dispatch({ type: types.DELETE_VIDEO, videoKey: video.key })
  })

  if (auth) {
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
