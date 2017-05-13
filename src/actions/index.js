import { hashHistory } from 'react-router'
import * as firebase from 'firebase'
import * as types from './types'

export function signupUser({ email, password }) {
  return dispatch => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(response => {
        dispatch({ type: types.AUTH_USER })
        hashHistory.push('/')
      })
      .catch(error => {
        dispatch(authError(error.message))
      })
  }
}

export function signinUser({ email, password }) {
  return dispatch => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(response => {
        dispatch({ type: types.AUTH_USER })
        hashHistory.push('/')
      })
      .catch(error => {
        dispatch(authError(error.message))
      })
  }
}

export function signoutUser() {
  return dispatch => {
    firebase.auth().signOut()
      .then(response => {
        dispatch({ type: types.UNAUTH_USER })
      })
      .catch(error => {
        dispatch(authError(error.message))
      })
  }
}

export function authError(error) {
  return { type: types.AUTH_ERROR, payload: error }
}

export function fetchBoards(localBoards) {
  const database = firebase.database()
  const user = firebase.auth().currentUser

  return dispatch => {
    dispatch({ type: 'FETCH_BOARDS_REQUESTED', boards: localBoards })

    return database.ref(`/boards/${user.uid}`)
      .once('value', snap => { dispatch({ type: 'FETCH_BOARDS_FULFILLED', boards: snap.val() }) })
      .catch(error => { dispatch({ type: 'FETCH_BOARDS_REJECTED' }) })
  }
}

export function fetchVideos(videos) {
  return { type: types.FETCH_VIDEOS, payload: videos }
}

export function importStorage() {
  return { type: types.IMPORT_STORAGE }
}

export function emptyStorage() {
  return { type: types.EMPTY_STORAGE }
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
  const database = firebase.database()
  const user = firebase.auth().currentUser

  return dispatch => {
    // TODO: Add type to types.js
    // TODO: Optimistic updates
    dispatch({ type: 'ADD_BOARD_REQUESTED', board })

    database.ref(`/boards/${user.uid}/${board.slug}`).set(board)
      .then(() => {
        dispatch({ type: 'ADD_BOARD_FULFILLED' })
        hashHistory.push(board.slug)
      })
      .catch(error => { dispatch({ type: 'ADD_BOARD_REJECTED' }) })
  }
}

export function editBoard(editingBoard, editingBoardPart) {
  return { type: types.EDIT_BOARD, payload: { editingBoard, editingBoardPart } }
}

export function deleteBoard(deletingBoard) {
  return { type: types.DELETE_BOARD, payload: deletingBoard }
}

export function addList(addingList, addingListCurrentBoardSlug) {
  return { type: types.ADD_LIST, payload: { addingList, addingListCurrentBoardSlug } }
}

export function editList(editingList, editingListPart, editingListCurrentBoard) {
  return { type: types.EDIT_LIST, payload: { editingList, editingListPart, editingListCurrentBoard } }
}

export function deleteList(deletingList, deletingListCurrentBoard) {
  return { type: types.DELETE_LIST, payload: { deletingList, deletingListCurrentBoard } }
}

export function addVideo(addingVideo) {
  return { type: types.ADD_VIDEO, payload: addingVideo }
}

export function editVideo(editingVideo, editingVideoPart) {
  return { type: types.EDIT_VIDEO, payload: { editingVideo, editingVideoPart } }
}

export function deleteVideo(deletingVideo) {
  return { type: types.DELETE_VIDEO, payload: deletingVideo }
}

export function emptyTrash() {
  return { type: types.EMPTY_TRASH }
}
