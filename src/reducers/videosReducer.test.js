import videos from './ReducerVideos'
import * as types from '../actions/types'
import { SAMPLE_BOARDS, SAMPLE_VIDEOS } from './SampleStorage'

describe('VIDEOs reducer', () => {
  it('should return the initial state', () => {
    const action = {}
    expect(videos(undefined, action)).toEqual([])
  })

  it('should handle FETCH_VIDEOS', () => {
    const action = { type: types.FETCH_VIDEOS, payload: SAMPLE_VIDEOS }
    expect(videos([], action)).toEqual(SAMPLE_VIDEOS)
  })

  it('should handle IMPORT_STORAGE', () => {
    const action = { type: types.IMPORT_STORAGE }
    expect(videos([], action)).toEqual(SAMPLE_VIDEOS)
    expect(videos([SAMPLE_VIDEOS[0]], action)).toEqual(SAMPLE_VIDEOS)
  })

  it('should handle EMPTY_STORAGE', () => {
    const action = { type: types.EMPTY_STORAGE }
    expect(videos(SAMPLE_VIDEOS, action)).toEqual([])
  })

  /* Board */
  it('should handle EDIT_BOARD', () => {
    const editingBoard = SAMPLE_BOARDS[0]
    const editingBoardPart = { title: 'Song', slug: 'song' }
    const action = { type: types.EDIT_BOARD, payload: { editingBoard, editingBoardPart } }
    videos(SAMPLE_VIDEOS, action).map(video => {
      expect(video).not.toMatchObject({ board: editingBoard.slug })
    })
  })

  it('should handle DELETE_BOARD', () => {
    const deletingBoard = SAMPLE_BOARDS[0]
    const action = { type: types.DELETE_BOARD, payload: deletingBoard }
    videos(SAMPLE_VIDEOS, action).map(video => {
      !video.board && expect(video.deleted).toEqual(true)
    })
  })

  /* List */
  it('should handle EDIT_LIST', () => {
    const editingList = SAMPLE_BOARDS[1].lists[0]
    const editingListPart = { title: 'Marine', slug: 'marine' }
    const editingListCurrentBoard = SAMPLE_BOARDS[1]
    const payload = { editingList, editingListPart, editingListCurrentBoard }
    const action = { type: types.EDIT_LIST, payload }
    videos(SAMPLE_VIDEOS, action).map(video => {
      expect(video).not.toMatchObject({ list: editingList.slug })
    })
  })

  it('should handle DELETE_LIST', () => {
    const deletingList = SAMPLE_BOARDS[0].lists[0]
    const deletingListCurrentBoard = SAMPLE_BOARDS[0]
    const action = { type: types.DELETE_LIST, payload: { deletingList, deletingListCurrentBoard } }
    videos(SAMPLE_VIDEOS, action).map(video => {
      !video.list && expect(video.deleted).toEqual(true)
    })
  })

  /* Video */
  it('should handle ADD_VIDEO', () => {
    const addingVideo = SAMPLE_VIDEOS[0]
    const action = { type: types.ADD_VIDEO, payload: addingVideo }
    expect(videos([], action)).toContain(addingVideo)
  })

  it('should handle EDIT_VIDEO', () => {
    const editingVideo = SAMPLE_VIDEOS[2]
    const editingVideoPart = { list: 'iron-man' }
    const payload = { editingVideo, editingVideoPart }
    const action = { type: types.EDIT_VIDEO, payload }
    expect(videos(SAMPLE_VIDEOS, action)[2].list).not.toEqual(editingVideo.list)
    expect(videos(SAMPLE_VIDEOS, action)[2].list).toEqual(editingVideoPart.list)
  })

  it('should handle DELETE_VIDEO', () => {
    const deletingVideo = SAMPLE_VIDEOS[0]
    const action = { type: types.DELETE_VIDEO, payload: deletingVideo }
    expect(videos(SAMPLE_VIDEOS, action)).not.toContain(deletingVideo)
  })
})
