import { db } from '../constants/api'
import types from '../constants/types'

export const addList = (boardKey, list) => (dispatch, getState) => {
  const { authenticated, user } = getState().auth
  const auth = authenticated
  const listKey = auth ? db.ref(`/boards/${user.uid}/${boardKey}/lists`).push().key : Date.now()
  list = { ...list, key: listKey }
  const syncingList = { ...list, isSyncing: true }

  dispatch({ type: types.ADD_LIST, boardKey, listKey, list: !auth ? list : syncingList })

  if (auth) {
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

export const editList = (boardKey, oldList, newList) => (dispatch, getState) => {
  const listKey = oldList.key
  const { authenticated, user } = getState().auth
  const auth = authenticated
  const syncingList = { ...newList, isSyncing: true }

  dispatch({ type: types.EDIT_LIST, boardKey, listKey, newList: !auth ? newList : syncingList })

  if (auth) {
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

export const deleteList = (board, list, videos) => (dispatch, getState) => {
  const boardKey = board.key
  const listKey = list.key
  const { authenticated, user } = getState().auth
  const auth = authenticated
  const deletedVideo = { list: null, deleted: true }

  videos.forEach(video => {
    dispatch({ type: types.EDIT_VIDEO, videoKey: video.key, newVideo: deletedVideo })
  })

  dispatch({ type: types.DELETE_LIST, boardKey, listKey })

  if (auth) {
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
