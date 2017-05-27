import { push } from 'react-router-redux'
import { auth, db } from '../config/constants'
import * as types from './types'
import { SAMPLE_BOARDS, SAMPLE_VIDEOS } from '../SampleStorage'

export function signupUser({ email, password }) {
  return dispatch => {
    auth().createUserWithEmailAndPassword(email, password)
      .then(response => {
        dispatch({ type: types.AUTH_USER })
        dispatch(push('/'))
      })
      .catch(error => { dispatch(authError(error.message)) })
  }
}

export function signinUser({ email, password }) {
  return dispatch => {
    auth().signInWithEmailAndPassword(email, password)
      .then(response => {
        dispatch({ type: types.AUTH_USER })
        dispatch(push('/'))
      })
      .catch(error => { dispatch(authError(error.message)) })
  }
}

export function signoutUser() {
  return dispatch => {
    auth().signOut()
      .then(response => { dispatch({ type: types.UNAUTH_USER }) })
      .catch(error => { dispatch(authError(error.message)) })
  }
}

export function authError(error) {
  return { type: types.AUTH_ERROR, payload: error }
}

export function fetchBoards(localBoards) {
  const user = auth().currentUser

  return dispatch => {
    dispatch({ type: 'FETCH_BOARDS_REQUESTED', boards: localBoards })
    db.ref(`/boards/${user.uid}`)
      .once('value', snap => { dispatch({ type: 'FETCH_BOARDS_FULFILLED', boards: snap.val() }) })
      .catch(error => { dispatch({ type: 'FETCH_BOARDS_REJECTED' }) })
  }
}

export function fetchVideos(localVideos) {
  const user = auth().currentUser

  return dispatch => {
    dispatch({ type: 'FETCH_VIDEOS_REQUESTED', videos: localVideos })
    db.ref(`/videos/${user.uid}`)
      .once('value', snap => { dispatch({ type: 'FETCH_VIDEOS_FULFILLED', videos: snap.val() }) })
      .catch(error => { dispatch({ type: 'FETCH_VIDEOS_REJECTED' }) })
  }
}

export function importStorage() {
  const user = auth().currentUser

  return dispatch => {
    const updates = {
      [`/boards/${user.uid}`]: SAMPLE_BOARDS,
      [`/videos/${user.uid}`]: SAMPLE_VIDEOS
    }

    dispatch({ type: 'IMPORT_STORAGE_REQUESTED', boards: SAMPLE_BOARDS, videos: SAMPLE_VIDEOS })
    db.ref().update(updates)
      .then(() => { dispatch({ type: 'IMPORT_STORAGE_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'IMPORT_STORAGE_REJECTED' }) })
  }
}

export function emptyStorage() {
  const user = auth().currentUser

  return dispatch => {
    const updates = {
      [`/boards/${user.uid}`]: null,
      [`/videos/${user.uid}`]: null
    }

    dispatch({ type: 'EMPTY_STORAGE_REQUESTED' })
    db.ref().update(updates)
      .then(() => { dispatch({ type: 'EMPTY_STORAGE_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'EMPTY_STORAGE_REJECTED' }) })
  }
}

export function pushStorage(props, prevProps) {
  if (JSON.stringify(prevProps.boards) !== JSON.stringify(props.boards)) {
    localStorage.boards = JSON.stringify(props.boards)
  }

  if (JSON.stringify(prevProps.videos) !== JSON.stringify(props.videos)) {
    localStorage.videos = JSON.stringify(props.videos)
  }

  return { type: types.PUSH_STORAGE }
}

export function addBoard(board) {
  const user = auth().currentUser

  return dispatch => {
    const boardsRef = db.ref(`/boards/${user.uid}`)
    const newBoardKey = boardsRef.push().key

    dispatch({ type: 'ADD_BOARD_REQUESTED', newBoardKey, board })
    dispatch(push(board.slug))
    boardsRef.child(newBoardKey).set(board)
      .then(() => { dispatch({ type: 'ADD_BOARD_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'ADD_BOARD_REJECTED' }) })
  }
}

export function editBoard(boardKey, newBoard) {
  const user = auth().currentUser

  return dispatch => {
    dispatch({ type: 'EDIT_BOARD_REQUESTED', boardKey, newBoard })
    dispatch(push(newBoard.slug))
    db.ref(`/boards/${user.uid}`).child(boardKey).update(newBoard)
      .then(() => { dispatch({ type: 'EDIT_BOARD_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'EDIT_BOARD_REJECTED' }) })
  }
}

export function deleteBoard(boardKey, videos) {
  const user = auth().currentUser

  return dispatch => {
    const newVideo = { board: null, list: null, deleted: true }
    let updates = { [`/boards/${user.uid}/${boardKey}`]: null }

    videos.map(videoKey => {
      updates[`/videos/${user.uid}/${videoKey}/board`] = null
      updates[`/videos/${user.uid}/${videoKey}/list`] = null
      updates[`/videos/${user.uid}/${videoKey}/deleted`] = true
      dispatch({ type: 'EDIT_VIDEO_REQUESTED', videoKey, newVideo })
      return false
    })

    dispatch({ type: 'DELETE_BOARD_REQUESTED', boardKey })
    dispatch(push('/'))
    db.ref().update(updates)
      .then(() => { dispatch({ type: 'DELETE_BOARD_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'DELETE_BOARD_REJECTED' }) })
  }
}

export function addList(boardKey, list) {
  const user = auth().currentUser

  return dispatch => {
    const listsRef = db.ref(`/boards/${user.uid}/${boardKey}/lists`)
    const newListKey = listsRef.push().key

    dispatch({ type: 'ADD_LIST_REQUESTED', boardKey, newListKey, list })
    listsRef.child(newListKey).set(list)
      .then(() => { dispatch({ type: 'ADD_LIST_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'ADD_LIST_REJECTED' }) })
  }
}

export function editList(boardKey, listKey, newList) {
  const user = auth().currentUser

  return dispatch => {
    dispatch({ type: 'EDIT_LIST_REQUESTED', boardKey, listKey, newList })
    db.ref(`/boards/${user.uid}/${boardKey}/lists/${listKey}`).update(newList)
      .then(() => { dispatch({ type: 'EDIT_LIST_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'EDIT_LIST_REJECTED' }) })
  }
}

export function deleteList(boardKey, listKey, videos) {
  const user = auth().currentUser

  return dispatch => {
    const newVideo = { list: null, deleted: true }
    let updates = { [`/boards/${user.uid}/${boardKey}/lists/${listKey}`]: null }

    videos.map(videoKey => {
      updates[`/videos/${user.uid}/${videoKey}/list`] = null
      updates[`/videos/${user.uid}/${videoKey}/deleted`] = true
      dispatch({ type: 'EDIT_VIDEO_REQUESTED', videoKey, newVideo })
      return false
    })

    dispatch({ type: 'DELETE_LIST_REQUESTED', boardKey, listKey })
    db.ref().update(updates)
      .then(() => { dispatch({ type: 'DELETE_LIST_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'DELETE_LIST_REJECTED' }) })
  }
}

export function addVideo(video) {
  const user = auth().currentUser

  return dispatch => {
    const videosRef = db.ref(`/videos/${user.uid}`)
    const newVideoKey = videosRef.push().key

    dispatch({ type: 'ADD_VIDEO_REQUESTED', newVideoKey, video })
    videosRef.child(newVideoKey).set(video)
      .then(() => { dispatch({ type: 'ADD_VIDEO_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'ADD_VIDEO_REJECTED' }) })
  }
}

export function editVideo(videoKey, newVideo) {
  const user = auth().currentUser

  return dispatch => {
    dispatch({ type: 'EDIT_VIDEO_REQUESTED', videoKey, newVideo })
    db.ref(`/videos/${user.uid}/${videoKey}`).update(newVideo)
      .then(() => { dispatch({ type: 'EDIT_VIDEO_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'EDIT_VIDEO_REJECTED' }) })
  }
}

export function deleteVideo(videoKey) {
  const user = auth().currentUser

  return dispatch => {
    dispatch({ type: 'DELETE_VIDEO_REQUESTED', videoKey })
    db.ref(`/videos/${user.uid}/${videoKey}`).remove()
      .then(() => { dispatch({ type: 'DELETE_VIDEO_FULFILLED' }) })
      .catch(error => { dispatch({ type: 'DELETE_VIDEO_REJECTED' }) })
  }
}

export function emptyTrash(videos) {
  const user = auth().currentUser

  return dispatch => {
    let updates = {}

    videos.map(videoKey => {
      updates[`/videos/${user.uid}/${videoKey}`] = null
      dispatch({ type: 'DELETE_VIDEO_REQUESTED', videoKey })
      return false
    })

    dispatch({ type: 'EMPTY_TRASH_REQUESTED' })
    db.ref().update(updates)
      .then(() => {
        dispatch({ type: 'EMPTY_TRASH_FULFILLED' })
        dispatch(push('/'))
      })
      .catch(error => { dispatch({ type: 'EMPTY_TRASH_REJECTED' }) })
  }
}
