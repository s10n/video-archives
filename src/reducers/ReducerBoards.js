import _ from 'lodash'
import * as types from '../actions/types'
import { SAMPLE_BOARDS } from './SampleStorage'

export default function (state = [], action) {
  switch(action.type) {
    case types.FETCH_BOARDS:
      return action.payload

    case types.IMPORT_STORAGE:
      return SAMPLE_BOARDS

    case types.EMPTY_STORAGE:
      return []

    case types.ADD_BOARD:
      const addingBoard = action.payload
      return [ ...state, { title: addingBoard.title, slug: addingBoard.slug, lists: [] } ]

    case types.EDIT_BOARD:
      const { editingBoard, editingBoardPart } = action.payload
      return state.map(board => {return board === editingBoard ?
        Object.assign({}, board, editingBoardPart) : board
      })

    case types.DELETE_BOARD:
      const deletingBoard = action.payload
      return _.without(state, deletingBoard)

    case types.ADD_LIST:
      const { addingList, addingListCurrentBoardSlug } = action.payload
      return state.map(board => {return board.slug === addingListCurrentBoardSlug ?
        { ...board, lists: [ ...board.lists, addingList ] } : board
      })

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
