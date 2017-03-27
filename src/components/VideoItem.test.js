import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { VideoItem } from './VideoItem'
import { SAMPLE_BOARDS, SAMPLE_VIDEOS } from '../reducers/SampleStorage.js'

describe('VideoItem', () => {
  let props, component

  beforeEach(() => {
    props = {
      video: SAMPLE_VIDEOS[2],
      boards: SAMPLE_BOARDS,
      addingVideo: false,
      editVideo: jest.fn(),
      deleteVideo: jest.fn(),
      addBoard: jest.fn(),
      addList: jest.fn()
    }
    component = shallow(<VideoItem {...props} />)
  })

  it('renders itself', () => {
    expect(component.length).toEqual(1)
  })

  it('has children elements', () => {
    const url = `https://www.youtube.com/watch?v=${SAMPLE_VIDEOS[2].data.id}`
    const title = SAMPLE_VIDEOS[2].data.snippet .title
    const thumbnailURL = SAMPLE_VIDEOS[2].data.snippet.thumbnails.high.url
    expect(component.find('img').length).toEqual(1)
    expect(component.find('img').props().src).toBe(thumbnailURL)
    expect(component.find('.VideoTitle').length).toEqual(1)
    expect(component.find('.VideoTitle').text()).toEqual(title)
    expect(component.find('.VideoTitle a').length).toEqual(1)
    expect(component.find('.VideoTitle a').props().href).toBe(url)
    expect(component.find('.VideoTitle a').props().target).toBe('_blank')
    expect(component.find('.VideoMeta').length).toEqual(1)
    expect(component.find('.VideoMeta date').length).toEqual(1)
    expect(component.find('.VideoMeta .btn-link').length).toEqual(2)
    component = shallow(<VideoItem {...props} addingVideo={true} />)
    expect(component.find('.VideoMeta .btn-link').length).toEqual(0)
  })

  describe('Move button', () => {
    let stub

    beforeEach(() => {
      stub = sinon.stub(window, 'prompt')
    })

    afterEach(() => {
      stub.restore()
    })

    it('moves video to another list if user clicks button', () => {
      const name = 'Macklemore'
      const slug = 'macklemore'
      stub.returns(name)
      component.find('button').first().simulate('click')
      expect(props.addList).not.toHaveBeenCalled()
      expect(props.editVideo).toHaveBeenCalledWith(SAMPLE_VIDEOS[2], { list: slug })
    })

    it('adds a list and moves video to the list if user clicks button', () => {
      const name = 'Iron Man'
      const slug = 'iron-man'
      stub.returns(name)
      component.find('button').first().simulate('click')
      expect(props.addList).toHaveBeenCalledWith({ name, slug }, SAMPLE_VIDEOS[2].board)
      expect(props.editVideo).toHaveBeenCalledWith(SAMPLE_VIDEOS[2], { list: slug })
    })
  })

  it('move to Trash if user clicks button', () => {
    component.find('button').last().simulate('click')
    expect(props.editVideo).toHaveBeenCalledWith(SAMPLE_VIDEOS[2], { deleted: true })
  })

  describe('VideoItem in Trash', () => {
    beforeEach(() => {
      props.video.deleted = true
      component = shallow(<VideoItem {...props} />)
    })

    it('recovers video to origin board if user clicks button', () => {
      const board = SAMPLE_VIDEOS[2].board
      component.find('button').first().simulate('click')
      expect(props.addBoard).not.toHaveBeenCalled()
      expect(props.editVideo).toHaveBeenCalledWith(SAMPLE_VIDEOS[2], { board, deleted: false })
    })

    it('recovers video to new board if user clicks button', () => {
      const stub = sinon.stub(window, 'prompt')
      stub.returns('Movie')
      props.video.board = null
      component = shallow(<VideoItem {...props} />)
      component.find('button').first().simulate('click')
      expect(props.addBoard).toHaveBeenCalledWith({ title: 'Movie', slug: 'movie' })
      stub.restore()
    })

    it('deletes video permanently if user clicks button', () => {
      const stub = sinon.stub(window, 'confirm')
      stub.returns(true)
      component.find('button').last().simulate('click')
      expect(props.deleteVideo).toHaveBeenCalledWith(SAMPLE_VIDEOS[2])
      stub.restore()
    })
  })
})
