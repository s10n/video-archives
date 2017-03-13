import * as types from './types'

export function fetchStorage() {
  const localVideoStorage = localStorage.videoStorage
  const storage = localVideoStorage ? JSON.parse(localVideoStorage) : null
  return { type: types.FETCH_STORAGE, payload: storage }
}

export function importStorage() {
  return { type: types.IMPORT_STORAGE }
}

export function emptyStorage() {
  return { type: types.EMPTY_STORAGE }
}

export function pushStorage(currentVideoStorage, prevVideoStorage) {
  if (JSON.stringify(prevVideoStorage) !== JSON.stringify(currentVideoStorage)) {
    localStorage.videoStorage = JSON.stringify(currentVideoStorage)
  }
  return { type: types.PUSH_STORAGE }
}

export function addBoard(addingBoard) {
  return { type: types.ADD_BOARD, payload: addingBoard }
}

export function editBoard(editingBoard, editingBoardPart) {
  return { type: types.EDIT_BOARD, payload: { editingBoard, editingBoardPart } }
}

export function deleteBoard(deletingBoard) {
  return { type: types.DELETE_BOARD, payload: deletingBoard }
}

export function addList(addingList, addingListCurrentBoard) {
  return { type: types.ADD_LIST, payload: { addingList, addingListCurrentBoard } }
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
