import * as types from './types'

export function fetchBoards(boards) {
  return { type: types.FETCH_BOARDS, payload: boards }
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

export function addBoard(addingBoard) {
  return { type: types.ADD_BOARD, payload: addingBoard }
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
