import { auth, db } from '../config/constants'
import * as types from './types'

export function addList(boardKey, list) {
  const user = auth().currentUser
  const listKey = user ? db.ref(`/boards/${user.uid}/${boardKey}/lists`).push().key : Date.now()

  return dispatch => {
    list = { ...list, key: listKey }
    const syncingList = { ...list, isSyncing: true }

    dispatch({ type: types.ADD_LIST, boardKey, listKey, list: !user ? list : syncingList })

    if (user) {
      db
        .ref(`/boards/${user.uid}/${boardKey}/lists/${listKey}`)
        .set(list)
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

export function editList(boardKey, oldList, newList) {
  const user = auth().currentUser
  const listKey = oldList.key

  return dispatch => {
    const syncingList = { ...newList, isSyncing: true }

    dispatch({ type: types.EDIT_LIST, boardKey, listKey, newList: !user ? newList : syncingList })

    if (user) {
      db
        .ref(`/boards/${user.uid}/${boardKey}/lists/${listKey}`)
        .update(newList)
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

export function deleteList(board, list, videos) {
  const user = auth().currentUser
  const boardKey = board.key
  const listKey = list.key

  return dispatch => {
    const deletedVideo = { list: null, deleted: true }

    videos.forEach(video => {
      dispatch({ type: types.EDIT_VIDEO, videoKey: video.key, newVideo: deletedVideo })
    })

    dispatch({ type: types.DELETE_LIST, boardKey, listKey })

    if (user) {
      let updates = { [`/boards/${user.uid}/${boardKey}/lists/${listKey}`]: null }

      videos.forEach(video => {
        updates[`/videos/${user.uid}/${video.key}/list`] = null
        updates[`/videos/${user.uid}/${video.key}/deleted`] = true
      })

      dispatch({ type: types.APP_STATUS, status: `App is deleting ${list.name}` })

      db
        .ref()
        .update(updates)
        .then(() => {
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.ADD_LIST, boardKey, listKey, list })
          videos.forEach(video => {
            const videoKey = video.key
            dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: { ...video, deleted: null } })
          })
        })
    }
  }
}
