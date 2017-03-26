import boards from './ReducerBoards'
import * as types from '../actions/types'
import { SAMPLE_BOARDS } from './SampleStorage'

describe('Boards reducer', () => {
  it('should return the initial state', () => {
    const action = {}
    expect(boards(undefined, action)).toEqual([])
  })

  it('should handle FETCH_BOARDS', () => {
    const action = { type: types.FETCH_BOARDS, payload: SAMPLE_BOARDS }
    expect(boards([], action)).toEqual(SAMPLE_BOARDS)
  })

  it('should handle IMPORT_STORAGE', () => {
    const action = { type: types.IMPORT_STORAGE }
    expect(boards([], action)).toEqual(SAMPLE_BOARDS)
    expect(boards([SAMPLE_BOARDS[0]], action)).toEqual(SAMPLE_BOARDS)
  })

  it('should handle EMPTY_STORAGE', () => {
    const action = { type: types.EMPTY_STORAGE }
    expect(boards(SAMPLE_BOARDS, action)).toEqual([])
  })

  /* BOARD */
  it('should handle ADD_BOARD', () => {
    const addingBoard0 = SAMPLE_BOARDS[0]
    const addingBoard1 = SAMPLE_BOARDS[1]
    const action0 = { type: types.ADD_BOARD, payload: addingBoard0 }
    const action1 = { type: types.ADD_BOARD, payload: addingBoard1 }
    expect(boards([], action0)).toEqual([{ ...addingBoard0, lists: []}])
    expect(boards([addingBoard0], action1)).toEqual([addingBoard0, { ...addingBoard1, lists: [] }])
  })

  it('should handle EDIT_BOARD', () => {
    const editingBoard = SAMPLE_BOARDS[0]
    const editingBoardPart = { title: 'Song', slug: 'song' }
    const action = { type: types.EDIT_BOARD, payload: { editingBoard, editingBoardPart } }
    expect(boards(SAMPLE_BOARDS, action)[0]).not.toMatchObject(SAMPLE_BOARDS[0])
    expect(boards(SAMPLE_BOARDS, action)[0]).toMatchObject(editingBoardPart)
  })

  it('should handle DELETE_BOARD', () => {
    const deletingBoard = SAMPLE_BOARDS[0]
    const action = { type: types.DELETE_BOARD, payload: deletingBoard }
    expect(SAMPLE_BOARDS).toContain(deletingBoard)
    expect(boards(SAMPLE_BOARDS, action)).not.toContain(deletingBoard)
  })

  /* List */
  it('should handle ADD_LIST', () => {
    const addingList = { name: 'Daft Punk', slug: 'daft-punk' }
    const addingListCurrentBoard = SAMPLE_BOARDS[0]
    const action = { type: types.ADD_LIST, payload: { addingList, addingListCurrentBoard } }
    expect(boards(SAMPLE_BOARDS, action)[0].lists).toContain(addingList)
  })

  it('should handle EDIT_LIST', () => {
    const editingList = SAMPLE_BOARDS[1].lists[0]
    const editingListPart = { title: 'Marine', slug: 'marine' }
    const editingListCurrentBoard = SAMPLE_BOARDS[1]
    const payload = { editingList, editingListPart, editingListCurrentBoard }
    const action = { type: types.EDIT_LIST, payload }
    expect(boards(SAMPLE_BOARDS, action)[1].lists).not.toContain(editingList)
    expect(boards(SAMPLE_BOARDS, action)[1].lists).toContain(editingListPart)
  })

  it('should handle DELETE_LIST', () => {
    const deletingList = SAMPLE_BOARDS[0].lists[0]
    const deletingListCurrentBoard = SAMPLE_BOARDS[0]
    const action = { type: types.DELETE_LIST, payload: { deletingList, deletingListCurrentBoard } }
    expect(deletingListCurrentBoard.lists).toContain(deletingList)
    expect(boards(SAMPLE_BOARDS, action)[0].lists).not.toContain(deletingList)
  })
})
