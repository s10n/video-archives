import { push } from 'react-router-redux'
import { auth, db } from '../config/constants'
import * as types from './types'

export function fetchBoards() {
  return dispatch => {
    const user = auth().currentUser
    const localBoards = localStorage.boards && JSON.parse(localStorage.boards)

    dispatch({ type: types.FETCH_BOARDS, boards: localBoards })

    if (user) {
      dispatch({ type: types.APP_STATUS, status: 'App is fetching...' })

      db.ref(`/boards/${user.uid}`)
        .once('value', snap => {
          dispatch({ type: types.FETCH_BOARDS, boards: snap.val() })
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: 'Error', error })
        })
    }
  }
}

export function addBoard(board) {
  return dispatch => {
    const user = auth().currentUser
    const newBoardKey = user ? db.ref(`/boards/${user.uid}`).push().key : Date.now()
    const syncingBoard = { ...board, isSyncing: true }

    dispatch({ type: types.ADD_BOARD, newBoardKey, board: !user ? board : syncingBoard })
    dispatch(push(board.slug))

    if (user) {
      const boardKey = newBoardKey

      db.ref(`/boards/${user.uid}/${newBoardKey}`).set(board)
        .then(() => {
          const syncedBoard = { ...board, isSyncing: false }
          dispatch({ type: types.EDIT_BOARD, boardKey, newBoard: syncedBoard })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: 'Error', error })
          dispatch({ type: types.DELETE_BOARD, boardKey })
          dispatch(push('/'))
        })
    }
  }
}

export function editBoard(boardKey, newBoard, oldBoard) {
  return dispatch => {
    const user = auth().currentUser
    const syncingBoard = { ...newBoard, isSyncing: true }

    dispatch({ type: types.EDIT_BOARD, boardKey, newBoard: !user ? newBoard : syncingBoard })
    dispatch(push(newBoard.slug))

    if (user) {
      db.ref(`/boards/${user.uid}`).child(boardKey).update(newBoard)
        .then(() => {
          const syncedBoard = { ...newBoard, isSyncing: false }
          dispatch({ type: types.EDIT_BOARD, boardKey, newBoard: syncedBoard })
        })
        .catch(error => {
          const syncedBoard = { ...oldBoard, isSyncing: false }
          dispatch({ type: types.APP_STATUS, status: 'Error', error })
          dispatch({ type: types.EDIT_BOARD, boardKey, newBoard: syncedBoard })
          dispatch(push(oldBoard.slug))
        })
    }
  }
}

export function deleteBoard(boardKey, videos, board) {
  return dispatch => {
    const user = auth().currentUser
    const deletedVideo = { board: null, list: null, deleted: true }

    Object.keys(videos).forEach(videoKey =>
      dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: deletedVideo })
    )

    dispatch({ type: types.DELETE_BOARD, boardKey })
    dispatch(push('/'))

    if (user) {
      let updates = { [`/boards/${user.uid}/${boardKey}`]: null }

      dispatch({ type: types.APP_STATUS, status: `App is deleting ${board.title}` })

      Object.keys(videos).forEach(videoKey => {
        updates[`/videos/${user.uid}/${videoKey}/board`] = null
        updates[`/videos/${user.uid}/${videoKey}/list`] = null
        updates[`/videos/${user.uid}/${videoKey}/deleted`] = true
      })

      db.ref().update(updates)
        .then(() => {
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: 'Error', error })
          dispatch({ type: types.ADD_BOARD, newBoardKey: boardKey, board })
          Object.keys(videos).forEach(videoKey =>
            dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: { ...videos[videoKey], deleted: false } })
          )
          dispatch(push(board.slug))
        })
    }
  }
}
