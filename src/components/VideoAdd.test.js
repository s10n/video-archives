import React from 'react'
import { mount } from 'enzyme'
import { VideoAdd, API_INFO, ERROR_MESSAGE } from './VideoAdd'
import { SAMPLE_BOARDS, SAMPLE_VIDEOS } from '../reducers/SampleStorage.js'

describe('VideoAdd', () => {
  let props, component, input, SAMPLE_ID, SAMPLE_URI

  beforeEach(() => {
    props = {
      boardSlug: 'music',
      listSlug: 'macklemore',
      videos: SAMPLE_VIDEOS,
      addVideo: jest.fn()
    }
    component = mount(<VideoAdd {...props} />)
    input = component.find('input')
    SAMPLE_ID = 'QK8mJJJvaes'
    SAMPLE_URI = `https://www.youtube.com/watch?v=${SAMPLE_ID}`
  })

  it('renders itself', () => {
    expect(component.length).toEqual(1)
  })

  it('has an input', () => {
    expect(input.length).toEqual(1)
    expect(input.props().type).toEqual('text')
    expect(input.props().placeholder).toBe('Add a video...')
    expect(component.find('.FetchResult').length).toEqual(0)
  })

  it('changes the text if user types text', () => {
    const value = SAMPLE_VIDEOS[0].data.id
    input.simulate('change', { target: { value } })
    expect(input.get(0).value).toBe(value)
  })

  it('shows error if video URI is not valid', () => {
    input.simulate('change', { target: { value: SAMPLE_ID.slice(0, -1) } })
    expect(component.find('.HelpBlock small').text()).toBe(ERROR_MESSAGE.invalid)
    input.simulate('change', { target: { value: SAMPLE_URI.slice(0, -1) } })
    expect(component.find('.HelpBlock small').text()).toBe(ERROR_MESSAGE.invalid)
    input.simulate('keyPress', { key: 'Enter' })
    expect(props.addVideo).not.toHaveBeenCalled()
    expect(component.find('.HelpBlock small').text()).toBe(ERROR_MESSAGE.invalid)
  })

  it('shows error if video already exists', () => {
    const value = SAMPLE_VIDEOS[0].data.id
    const expected = `${ERROR_MESSAGE.exists}: ${SAMPLE_VIDEOS[0].board} - ${SAMPLE_VIDEOS[0].list}`
    input.simulate('change', { target: { value } })
    expect(component.find('.HelpBlock small').text()).toBe(expected)
    input.simulate('keyPress', { key: 'Enter' })
    expect(props.addVideo).not.toHaveBeenCalled()
    expect(component.find('.HelpBlock small').text()).toBe(expected)
  })

  // TODO:
  // describe('fetching', () => {
  //   it('shows message while video is being fetched', () => {
  //     const value = SAMPLE_URI
  //     input.simulate('change', { target: { value } })
  //     expect(component.find('.HelpBlock small').text()).toBe(ERROR_MESSAGE.fetching)
  //   })

  //   it('shows message if video is fetched successfully', () => {
  //     const value = SAMPLE_ID
  //     const board = props.boardSlug
  //     const list = props.listSlug
  //     input.simulate('change', { target: { value } })
  //     expect(component.find('.HelpBlock small').text()).toBe(ERROR_MESSAGE.success)
  //     input.simulate('keyPress', { key: 'Enter' })
  //     expect(props.addVideo).toHaveBeenCalledWith({ board, list, source: 'YouTube', data })
  //     expect(component.find('.FetchResult').length).toEqual(0)
  //   })

  //   it('shows error if video is not fetched', () => {
  //     const value = '-----------'
  //     input.simulate('change', { target: { value } })
  //     expect(component.find('.HelpBlock small').text()).toBe(ERROR_MESSAGE.noResults)
  //     input.simulate('keyPress', { key: 'Enter' })
  //     expect(props.addVideo).not.toHaveBeenCalled()
  //     expect(component.find('.HelpBlock small').text()).toBe(ERROR_MESSAGE.noResults)
  //   })
  // })
})
