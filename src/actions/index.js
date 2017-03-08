export const FETCH_STORAGE = 'FETCH_STORAGE'
export const PUSH_STORAGE = 'PUSH_STORAGE'
export const ADD_BOARD = 'ADD_BOARD'
export const ADD_LIST = 'ADD_LIST'
export const ADD_VIDEO = 'ADD_VIDEO'

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

export function addList(listName, currentBoardSlug) {
  return { type: ADD_LIST, payload: { listName, currentBoardSlug } }
}

export function addVideo(videoItem) {
  return { type: ADD_VIDEO, payload: videoItem }
}
