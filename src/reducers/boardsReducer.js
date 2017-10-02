import dotProp from 'dot-prop-immutable'
import types from '../constants/types'

export default (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_BOARDS:
      return action.boards || {}

    case types.IMPORT_STORAGE:
      return action.boards

    case types.EMPTY_STORAGE:
      return {}

    case types.ADD_BOARD:
      return dotProp.set(state, action.boardKey, action.board)

    case types.EDIT_BOARD:
      return dotProp.merge(state, action.boardKey, action.newBoard)

    case types.DELETE_BOARD:
      return dotProp.delete(state, action.boardKey)

    case types.ADD_LIST:
      return dotProp.set(state, `${action.boardKey}.lists.${action.listKey}`, action.list)

    case types.EDIT_LIST:
      return dotProp.merge(state, `${action.boardKey}.lists.${action.listKey}`, action.newList)

    case types.DELETE_LIST:
      return dotProp.delete(state, `${action.boardKey}.lists.${action.listKey}`)

    default:
      return state
  }
}
