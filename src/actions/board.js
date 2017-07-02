import { push } from 'react-router-redux'
import { auth, db } from '../config/constants'
import * as types from './types'
import { editVideo } from './video'

export function fetchBoards() {
  return dispatch => {
    const user = auth().currentUser
    const localBoards = localStorage.boards && JSON.parse(localStorage.boards)

    dispatch(
      !user
        ? { type: types.FETCH_BOARDS, boards: localBoards }
        : { type: types.FETCH_BOARDS, boards: localBoards, isBoardsFetching: true }
    )

    if (user) {
      db.ref(`/boards/${user.uid}`)
        .once('value', snap => {
          dispatch({ type: types.FETCH_BOARDS, boards: snap.val(), isBoardsFetching: false })
        })
        .catch(error => {
          dispatch({ type: types.FETCH_BOARDS_REJECTED, error })
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
      db.ref(`/boards/${user.uid}/${newBoardKey}`).set(board)
        .then(() => {
          const boardKey = newBoardKey
          const newBoard = { ...board, isSyncing: false }
          dispatch({ type: types.EDIT_BOARD, boardKey, newBoard })
        })
        .catch(error => {
          const boardKey = newBoardKey
          console.error(error)
          dispatch({ type: types.DELETE_BOARD, boardKey })
          dispatch(push('/'))
        })
    }
  }
}

export function editBoard(boardKey, newBoard) {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.EDIT_BOARD, boardKey, newBoard })
    dispatch(push(newBoard.slug))

    if (user) {
      db.ref(`/boards/${user.uid}`).child(boardKey).update(newBoard)
        .then(() => { dispatch({ type: 'EDIT_BOARD_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'EDIT_BOARD_REJECTED' }) })
    }
  }
}

export function deleteBoard(boardKey, videos) {
  return dispatch => {
    const user = auth().currentUser

    videos.map(videoKey => {
      dispatch(editVideo(videoKey, { board: null, list: null, deleted: true }))
      return false
    })

    dispatch({ type: types.DELETE_BOARD, boardKey })
    dispatch(push('/'))

    if (user) {
      let updates = { [`/boards/${user.uid}/${boardKey}`]: null }

      videos.map(videoKey => {
        updates[`/videos/${user.uid}/${videoKey}/board`] = null
        updates[`/videos/${user.uid}/${videoKey}/list`] = null
        updates[`/videos/${user.uid}/${videoKey}/deleted`] = true
        return false
      })

      db.ref().update(updates)
        .then(() => { dispatch({ type: 'DELETE_BOARD_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'DELETE_BOARD_REJECTED' }) })
    }
  }
}
