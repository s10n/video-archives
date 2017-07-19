import { push } from 'react-router-redux'
import { auth, db } from '../config/constants'
import * as types from './types'

export function fetchBoards() {
  const user = auth().currentUser
  const localBoards = localStorage.boards && JSON.parse(localStorage.boards)

  return dispatch => {
    dispatch({ type: types.FETCH_BOARDS, boards: localBoards })

    if (user) {
      dispatch({ type: types.APP_STATUS, status: 'App is fetching boards' })

      db
        .ref(`/boards/${user.uid}`)
        .once('value', snap => {
          dispatch({ type: types.FETCH_BOARDS, boards: snap.val() })
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
        })
    }
  }
}

export function addBoard(board) {
  const user = auth().currentUser
  const boardKey = user ? db.ref(`/boards/${user.uid}`).push().key : Date.now()

  return dispatch => {
    board = { ...board, key: boardKey }
    const syncingBoard = { ...board, isSyncing: true }

    dispatch({ type: types.ADD_BOARD, boardKey, board: !user ? board : syncingBoard })
    dispatch(push(board.slug))

    if (user) {
      db
        .ref(`/boards/${user.uid}/${boardKey}`)
        .set(board)
        .then(() => {
          const syncedBoard = { ...board, isSyncing: false }
          dispatch({ type: types.EDIT_BOARD, boardKey: boardKey, newBoard: syncedBoard })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.DELETE_BOARD, boardKey: boardKey })
          dispatch(push('/'))
        })
    }
  }
}

export function editBoard(oldBoard, newBoard) {
  const user = auth().currentUser
  const boardKey = oldBoard.key

  return dispatch => {
    const syncingBoard = { ...newBoard, isSyncing: true }

    dispatch({ type: types.EDIT_BOARD, boardKey, newBoard: !user ? newBoard : syncingBoard })
    dispatch(push(newBoard.slug))

    if (user) {
      db
        .ref(`/boards/${user.uid}`)
        .child(boardKey)
        .update(newBoard)
        .then(() => {
          const syncedBoard = { ...newBoard, isSyncing: false }
          dispatch({ type: types.EDIT_BOARD, boardKey, newBoard: syncedBoard })
        })
        .catch(error => {
          const syncedBoard = { ...oldBoard, isSyncing: false }
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.EDIT_BOARD, boardKey, newBoard: syncedBoard })
          dispatch(push(oldBoard.slug))
        })
    }
  }
}

export function deleteBoard(board, videos) {
  const user = auth().currentUser
  const boardKey = board.key

  return dispatch => {
    const deletedVideo = { board: null, list: null, deleted: true }

    videos.forEach(video => {
      const videoKey = video.key
      dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: deletedVideo })
    })

    dispatch({ type: types.DELETE_BOARD, boardKey })
    dispatch(push('/'))

    if (user) {
      let updates = { [`/boards/${user.uid}/${boardKey}`]: null }

      dispatch({ type: types.APP_STATUS, status: `App is deleting ${board.title}` })

      videos.forEach(video => {
        updates[`/videos/${user.uid}/${video.key}/board`] = null
        updates[`/videos/${user.uid}/${video.key}/list`] = null
        updates[`/videos/${user.uid}/${video.key}/deleted`] = true
      })

      db
        .ref()
        .update(updates)
        .then(() => {
          dispatch({ type: types.APP_STATUS, status: null })
        })
        .catch(error => {
          dispatch({ type: types.APP_STATUS, status: error.message })
          dispatch({ type: types.ADD_BOARD, newBoardKey: boardKey, board })
          videos.forEach(video => {
            const videoKey = video.key
            dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: { ...video, deleted: null } })
          })
          dispatch(push(board.slug))
        })
    }
  }
}
