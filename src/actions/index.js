export const FETCH_STORAGE = 'FETCH_STORAGE'
export const PUSH_STORAGE = 'PUSH_STORAGE'

export const ADD_BOARD = 'ADD_BOARD'
export const EDIT_BOARD = 'EDIT_BOARD'
export const DELETE_BOARD = 'DELETE_BOARD'

export const ADD_LIST = 'ADD_LIST'
export const EDIT_LIST = 'EDIT_LIST'
export const DELETE_LIST = 'DELETE_LIST'

export const ADD_VIDEO = 'ADD_VIDEO'
export const EDIT_VIDEO = 'EDIT_VIDEO'
export const DELETE_VIDEO = 'DELETE_VIDEO'

export const EMPTY_TRASH = 'EMPTY_TRASH'

export function fetchStorage() {
  const localVideoStorage = localStorage.videoStorage
  const payload = localVideoStorage ? JSON.parse(localVideoStorage) : null
  return { type: FETCH_STORAGE, payload: payload }
}

export function pushStorage(currentVideoStorage, prevVideoStorage) {
  if (JSON.stringify(prevVideoStorage) !== JSON.stringify(currentVideoStorage)) {
    localStorage.videoStorage = JSON.stringify(currentVideoStorage)
  }
  return { type: PUSH_STORAGE }
}

export function addBoard(newBoard) {
  return { type: ADD_BOARD, payload: newBoard }
}

export function editBoard(editingBoard, editingBoardPart) {
  return { type: EDIT_BOARD, payload: { editingBoard, editingBoardPart } }
}

export function deleteBoard(deletingBoard) {
  return { type: DELETE_BOARD, payload: deletingBoard }
}

export function addList(newList, boardSlug) {
  return { type: ADD_LIST, payload: { newList, boardSlug } }
}

export function editList(editingList, editingListPart, editingListCurrentBoard) {
  return { type: EDIT_LIST, payload: { editingList, editingListPart, editingListCurrentBoard } }
}

export function deleteList(deletingList) {
  return { type: DELETE_LIST, payload: deletingList }
}

export function addVideo(newVideo) {
  return { type: ADD_VIDEO, payload: newVideo }
}

export function editVideo(editingVideo, editingVideoPart) {
  return { type: EDIT_VIDEO, payload: { editingVideo, editingVideoPart } }
}

export function deleteVideo(deletingVideo) {
  return { type: DELETE_VIDEO, payload: deletingVideo }
}

export function emptyTrash() {
  return { type: EMPTY_TRASH }
}
