import { auth, db } from '../config/constants'
import * as types from './types'
import { editVideo } from './video'

export function addList(boardKey, list) {
  return dispatch => {
    const user = auth().currentUser
    const newListKey = user ? db.ref(`/boards/${user.uid}/${boardKey}/lists`).push().key : Date.now()

    dispatch({ type: types.ADD_LIST, boardKey, newListKey, list })

    if (user) {
      db.ref(`/boards/${user.uid}/${boardKey}/lists/${newListKey}`).set(list)
        .then(() => { dispatch({ type: 'ADD_LIST_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'ADD_LIST_REJECTED' }) })
    }
  }
}

export function editList(boardKey, listKey, newList) {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.EDIT_LIST, boardKey, listKey, newList })

    if (user) {
      db.ref(`/boards/${user.uid}/${boardKey}/lists/${listKey}`).update(newList)
        .then(() => { dispatch({ type: 'EDIT_LIST_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'EDIT_LIST_REJECTED' }) })
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
