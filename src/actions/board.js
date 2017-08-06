import { push } from 'react-router-redux'
import { db } from '../constants/api'
import types from '../constants/types'

export function fetchBoards() {
  const localBoards = localStorage.boards && JSON.parse(localStorage.boards)

  return (dispatch, getState) => {
    const { authenticated, uid } = getState().auth
    const auth = authenticated
    dispatch({ type: types.FETCH_BOARDS, boards: localBoards })

    if (auth) {
      dispatch({ type: types.APP_STATUS, status: 'App is fetching boards' })

      db
        .ref(`/boards/${uid}`)
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
  return (dispatch, getState) => {
    const { authenticated, uid } = getState().auth
    const auth = authenticated
    const boardKey = auth ? db.ref(`/boards/${uid}`).push().key : Date.now()
    board = { ...board, key: boardKey }
    const syncingBoard = { ...board, isSyncing: true }

    dispatch({ type: types.ADD_BOARD, boardKey, board: !auth ? board : syncingBoard })
    dispatch(push(board.slug))

    if (auth) {
      db
        .ref(`/boards/${uid}/${boardKey}`)
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
  return (dispatch, getState) => {
    const { authenticated, uid } = getState().auth
    const auth = authenticated
    const boardKey = oldBoard.key
    const syncingBoard = { ...newBoard, isSyncing: true }

    dispatch({ type: types.EDIT_BOARD, boardKey, newBoard: !auth ? newBoard : syncingBoard })
    dispatch(push(newBoard.slug))

    if (auth) {
      db
        .ref(`/boards/${uid}`)
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
  return (dispatch, getState) => {
    const { authenticated, uid } = getState().auth
    const auth = authenticated
    const boardKey = board.key
    const deletedVideo = { board: null, list: null, deleted: true }

    videos.forEach(video => {
      const videoKey = video.key
      dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo: deletedVideo })
    })

    dispatch({ type: types.DELETE_BOARD, boardKey })
    dispatch(push('/'))

    if (auth) {
      let updates = { [`/boards/${uid}/${boardKey}`]: null }

      dispatch({ type: types.APP_STATUS, status: `App is deleting ${board.title}` })

      videos.forEach(video => {
        updates[`/videos/${uid}/${video.key}/board`] = null
        updates[`/videos/${uid}/${video.key}/list`] = null
        updates[`/videos/${uid}/${video.key}/deleted`] = true
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
