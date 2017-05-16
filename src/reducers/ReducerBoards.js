import _ from 'lodash'
import dotProp from 'dot-prop-immutable'
// import * as types from '../actions/types'

export default function (state = {}, action) {
  switch(action.type) {
    case 'FETCH_BOARDS_REQUESTED':
      return action.boards || {}

    case 'FETCH_BOARDS_FULFILLED':
      return action.boards || {}

    case 'IMPORT_STORAGE_REQUESTED':
      return action.boards

    case 'EMPTY_STORAGE_REQUESTED':
      return {}

    case 'ADD_BOARD_REQUESTED':
      return { ...state, [action.newBoardKey]: action.board }

    case 'EDIT_BOARD_REQUESTED':
      return dotProp.merge(state, action.boardKey, action.newBoard)

    case 'DELETE_BOARD_REQUESTED':
      return dotProp.delete(state, action.boardKey)

    case 'ADD_LIST_REQUESTED':
      return dotProp.set(state, `${action.boardKey}.lists.${action.newListKey}`, action.list)

    case 'EDIT_LIST_REQUESTED':
      return dotProp.set(state, `${action.boardKey}.lists.${action.listKey}`, action.newList)

    case 'DELETE_LIST_REQUESTED':
      return dotProp.delete(state, `${action.boardKey}.lists.${action.listKey}`)

    default:
      return state
  }
}
