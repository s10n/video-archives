import _ from 'lodash'
import dotProp from 'dot-prop-immutable'
import * as types from '../actions/types'

export default function (state = {}, action) {
  switch(action.type) {
    case 'FETCH_BOARDS_REQUESTED':
      return action.boards || {}

    case 'FETCH_BOARDS_FULFILLED':
      return action.boards || {}

    case 'IMPORT_STORAGE_REQUESTED':
      return action.boards

    case types.EMPTY_STORAGE:
      return []

    case 'ADD_BOARD_REQUESTED':
      return { ...state, [action.newBoardKey]: action.board }

    case types.EDIT_BOARD:
      const { editingBoard, editingBoardPart } = action.payload
      return state.map(board => {return board === editingBoard ?
        { ...board, ...editingBoardPart } : board
      })

    case types.DELETE_BOARD:
      const deletingBoard = action.payload
      return _.without(state, deletingBoard)

    case 'ADD_LIST_REQUESTED':
      return dotProp.set(state, `${action.boardKey}.lists.${action.newListKey}`, action.list)

    case types.EDIT_LIST:
      const { editingList, editingListPart, editingListCurrentBoard } = action.payload
      return state.map(board => {return board === editingListCurrentBoard ?
        { ...board,
          lists: board.lists.map(list => {return list === editingList ? editingListPart : list})
        } : board
      })

    case types.DELETE_LIST:
      const { deletingList, deletingListCurrentBoard } = action.payload
      return state.map(board => {return board === deletingListCurrentBoard ?
        { ...board, lists: _.without(board.lists, deletingList) } : board
      })

    default:
      return state
  }
}
