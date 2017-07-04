import { auth, db } from '../config/constants'
import * as types from './types'

export function addList(boardKey, list) {
  return dispatch => {
    const user = auth().currentUser
    const newListKey = user ? db.ref(`/boards/${user.uid}/${boardKey}/lists`).push().key : Date.now()
    const syncingList = { ...list, isSyncing: true }

    dispatch({ type: types.ADD_LIST, boardKey, newListKey, list: !user ? list : syncingList })

    if (user) {
      const listKey = newListKey

      db.ref(`/boards/${user.uid}/${boardKey}/lists/${newListKey}`).set(list)
        .then(() => {
          const syncedList = { ...list, isSyncing: false }
          dispatch({ type: types.EDIT_LIST, boardKey, listKey, newList: syncedList })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.DELETE_LIST, boardKey, listKey })
        })
    }
  }
}

export function editList(boardKey, listKey, newList, oldList) {
  return dispatch => {
    const user = auth().currentUser
    const syncingList = { ...newList, isSyncing: true }

    dispatch({ type: types.EDIT_LIST, boardKey, listKey, newList: !user ? newList : syncingList })

    if (user) {
      db.ref(`/boards/${user.uid}/${boardKey}/lists/${listKey}`).update(newList)
        .then(() => {
          const syncedList = { ...newList, isSyncing: false }
          dispatch({ type: types.EDIT_LIST, boardKey, listKey, newList: syncedList })
        })
        .catch(error => {
          const syncedList = { ...oldList, isSyncing: false }
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.EDIT_LIST, boardKey, listKey, newList: syncedList })
        })
    }
  }
}

export function deleteList(boardKey, listKey, videos, list) {
  return dispatch => {
    const user = auth().currentUser
    const deletedVideo = { list: null, deleted: true }

    Object.keys(videos).forEach(videoKey => {
      dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: deletedVideo })
    })

    dispatch({ type: types.DELETE_LIST, boardKey, listKey })

    if (user) {
      let updates = { [`/boards/${user.uid}/${boardKey}/lists/${listKey}`]: null }

      Object.keys(videos).forEach(videoKey => {
        updates[`/videos/${user.uid}/${videoKey}/list`] = null
        updates[`/videos/${user.uid}/${videoKey}/deleted`] = true
      })

      dispatch({ type: types.APP_STATUS, status: `App is deleting ${list.name}` })

      db.ref().update(updates)
        .then(() => {
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.ADD_LIST, boardKey, newListKey: listKey, list })
          Object.keys(videos).forEach(videoKey =>
            dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: { ...videos[videoKey], deleted: false } })
          )
        })
    }
  }
}
