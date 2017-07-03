import { auth, db } from '../config/constants'
import * as types from './types'
import { editVideo } from './video'

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
          dispatch({ type: types.APP_STATUS, status: 'Error', error })
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
          dispatch({ type: types.APP_STATUS, status: 'Error', error })
          dispatch({ type: types.EDIT_LIST, boardKey, listKey, newList: syncedList })
        })
    }
  }
}

export function deleteList(boardKey, listKey, videos) {
  return dispatch => {
    const user = auth().currentUser

    videos.map(videoKey => {
      dispatch(editVideo(videoKey, { list: null, deleted: true }))
      return false
    })

    dispatch({ type: types.DELETE_LIST, boardKey, listKey })

    if (user) {
      let updates = { [`/boards/${user.uid}/${boardKey}/lists/${listKey}`]: null }

      videos.map(videoKey => {
        updates[`/videos/${user.uid}/${videoKey}/list`] = null
        updates[`/videos/${user.uid}/${videoKey}/deleted`] = true
        return false
      })

      db.ref().update(updates)
        .then(() => { dispatch({ type: 'DELETE_LIST_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'DELETE_LIST_REJECTED' }) })
    }
  }
}
