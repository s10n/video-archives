import * as actions from './index'
import * as types from './types'
import { SAMPLE_BOARDS, SAMPLE_VIDEOS } from '../reducers/SampleStorage'

describe('actions', () => {
  describe('should create an action to', () => {
    let prevProps
    let props

    beforeEach(() => {
      prevProps = { boards: [], videos: [] }
      props = { boards: SAMPLE_BOARDS, videos: SAMPLE_VIDEOS }
    })

    it('fetch boards and videos', () => {
      actions.pushStorage(props, prevProps)
      expect(actions.fetchBoards(SAMPLE_BOARDS)).toEqual({ type: types.FETCH_BOARDS, payload: SAMPLE_BOARDS })
      expect(actions.fetchVideos(SAMPLE_VIDEOS)).toEqual({ type: types.FETCH_VIDEOS, payload: SAMPLE_VIDEOS })
    })

    it('import and empty storage', () => {
      expect(actions.importStorage()).toEqual({ type: types.IMPORT_STORAGE })
      expect(actions.emptyStorage()).toEqual({ type: types.EMPTY_STORAGE })
    })

    it('push storage', () => {
      expect(actions.pushStorage(props, prevProps)).toEqual({ type: types.PUSH_STORAGE })
      expect(localStorage.boards).toEqual(JSON.stringify(SAMPLE_BOARDS))
      expect(localStorage.videos).toEqual(JSON.stringify(SAMPLE_VIDEOS))
    })
  })

  describe('should create an action to', () => {
    it('addBoard', () => {
      expect(actions.addBoard('addingBoard')).toEqual({
        type: types.ADD_BOARD,
        payload: 'addingBoard'
      })
    })

    it('editBoard', () => {
      expect(actions.editBoard('editingBoard', 'editingBoardPart')).toEqual({
        type: types.EDIT_BOARD,
        payload: {
          editingBoard: 'editingBoard',
          editingBoardPart: 'editingBoardPart'
        }
      })
    })

    it('deleteBoard', () => {
      expect(actions.deleteBoard('deletingBoard')).toEqual({
        type: types.DELETE_BOARD,
        payload: 'deletingBoard'
      })
    })

    it('addList', () => {
      expect(actions.addList('addingList', 'addingListCurrentBoard')).toEqual({
        type: types.ADD_LIST,
        payload: {
          addingList: 'addingList',
          addingListCurrentBoard: 'addingListCurrentBoard'
        }
      })
    })

    it('editList', () => {
      expect(actions.editList('editingList', 'editingListPart', 'editingListCurrentBoard')).toEqual({
        type: types.EDIT_LIST,
        payload: {
          editingList: 'editingList',
          editingListPart: 'editingListPart',
          editingListCurrentBoard: 'editingListCurrentBoard'
        }
      })
    })

    it('deleteList', () => {
      expect(actions.deleteList('deletingList', 'deletingListCurrentBoard')).toEqual({
        type: types.DELETE_LIST,
        payload: {
          deletingList: 'deletingList',
          deletingListCurrentBoard: 'deletingListCurrentBoard'
        }
      })
    })

    it('addVideo', () => {
      expect(actions.addVideo('addingVideo')).toEqual({
        type: types.ADD_VIDEO,
        payload: 'addingVideo'
      })
    })

    it('editVideo', () => {
      expect(actions.editVideo('editingVideo', 'editingVideoPart')).toEqual({
        type: types.EDIT_VIDEO,
        payload: {
          editingVideo: 'editingVideo',
          editingVideoPart: 'editingVideoPart'
        }
      })
    })

    it('deleteVideo', () => {
      expect(actions.deleteVideo('deletingVideo')).toEqual({
        type: types.DELETE_VIDEO,
        payload: 'deletingVideo'
      })
    })

    it('emptyTrash', () => {
      expect(actions.emptyTrash()).toEqual({ type: types.EMPTY_TRASH })
    })
  })
})
