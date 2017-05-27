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

function authError(error) {
  return { type: types.AUTH_ERROR, payload: error }
}

export function fetchBoards(localBoards) {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.FETCH_BOARDS, boards: localBoards })

    if (user) {
      db.ref(`/boards/${user.uid}`)
        .once('value', snap => { dispatch({ type: 'FETCH_BOARDS_FULFILLED', boards: snap.val() }) })
        .catch(error => { dispatch({ type: 'FETCH_BOARDS_REJECTED' }) })
    }
  }
}

export function fetchVideos(localVideos) {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.FETCH_VIDEOS, videos: localVideos })

    if (user) {
      db.ref(`/videos/${user.uid}`)
        .once('value', snap => { dispatch({ type: 'FETCH_VIDEOS_FULFILLED', videos: snap.val() }) })
        .catch(error => { dispatch({ type: 'FETCH_VIDEOS_REJECTED' }) })
    }
  }
}

export function importStorage() {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.IMPORT_STORAGE, boards: SAMPLE_BOARDS, videos: SAMPLE_VIDEOS })

    if (user) {
      const updates = {
        [`/boards/${user.uid}`]: SAMPLE_BOARDS,
        [`/videos/${user.uid}`]: SAMPLE_VIDEOS
      }

      db.ref().update(updates)
        .then(() => { dispatch({ type: 'IMPORT_STORAGE_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'IMPORT_STORAGE_REJECTED' }) })
    }
  }
}

export function emptyStorage() {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.EMPTY_STORAGE })

    if (user) {
      const updates = {
        [`/boards/${user.uid}`]: null,
        [`/videos/${user.uid}`]: null
      }

      db.ref().update(updates)
        .then(() => { dispatch({ type: 'EMPTY_STORAGE_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'EMPTY_STORAGE_REJECTED' }) })
    }
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
  return dispatch => {
    const user = auth().currentUser
    const newBoardKey = user ? db.ref(`/boards/${user.uid}`).push().key : Date.now()

    dispatch({ type: types.ADD_BOARD, newBoardKey, board })
    dispatch(push(board.slug))

    if (user) {
      db.ref(`/boards/${user.uid}/${newBoardKey}`).set(board)
        .then(() => { dispatch({ type: 'ADD_BOARD_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'ADD_BOARD_REJECTED' }) })
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
    const newVideo = { board: null, list: null, deleted: true }

    videos.map(videoKey => {
      dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo })
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
    const newVideo = { list: null, deleted: true }

    videos.map(videoKey => {
      dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo })
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

export function addVideo(video) {
  return dispatch => {
    const user = auth().currentUser
    const newVideoKey = user ? db.ref(`/videos/${user.uid}`).push().key : Date.now()

    dispatch({ type: types.ADD_VIDEO, newVideoKey, video })

    if (user) {
      db.ref(`/videos/${user.uid}/${newVideoKey}`).set(video)
        .then(() => { dispatch({ type: 'ADD_VIDEO_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'ADD_VIDEO_REJECTED' }) })
    }
  }
}

export function editVideo(videoKey, newVideo) {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.EDIT_VIDEO, videoKey, newVideo })

    if (user) {
      db.ref(`/videos/${user.uid}/${videoKey}`).update(newVideo)
        .then(() => { dispatch({ type: 'EDIT_VIDEO_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'EDIT_VIDEO_REJECTED' }) })
    }
  }
}

export function deleteVideo(videoKey) {
  return dispatch => {
    const user = auth().currentUser

    dispatch({ type: types.DELETE_VIDEO, videoKey })

    if (user) {
      db.ref(`/videos/${user.uid}/${videoKey}`).remove()
        .then(() => { dispatch({ type: 'DELETE_VIDEO_FULFILLED' }) })
        .catch(error => { dispatch({ type: 'DELETE_VIDEO_REJECTED' }) })
    }
  }
}

export function emptyTrash(videos) {
  return dispatch => {
    const user = auth().currentUser

    videos.map(videoKey => {
      dispatch({ type: types.DELETE_VIDEO, videoKey })
      return false
    })

    dispatch({ type: types.EMPTY_TRASH })

    if (user) {
      let updates = {}

      videos.map(videoKey => {
        updates[`/videos/${user.uid}/${videoKey}`] = null
        return false
      })

      db.ref().update(updates)
        .then(() => {
          dispatch({ type: 'EMPTY_TRASH_FULFILLED' })
          dispatch(push('/'))
        })
        .catch(error => { dispatch({ type: 'EMPTY_TRASH_REJECTED' }) })
    }
  }
}
