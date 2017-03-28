import React from 'react'
import { shallow  } from 'enzyme'
import { VideoList } from './VideoList'
import { SAMPLE_BOARDS, SAMPLE_VIDEOS } from '../reducers/SampleStorage.js'

describe('VideoList', () => {
  let props, component

  beforeEach(() => {
    props = {
      list: SAMPLE_BOARDS[0].lists[0],
      videoList: [SAMPLE_VIDEOS[0], SAMPLE_VIDEOS[1], SAMPLE_VIDEOS[2]],
      currentBoard: SAMPLE_BOARDS[0],
      editList: jest.fn(),
      deleteList: jest.fn()
    }
    component = shallow(<VideoList {...props} />)
  })

  it('renders itself', () => {
    expect(component.length).toEqual(1)
  })

  it('has children elements', () => {
    expect(component.find('.Card').length).toEqual(1)
    expect(component.find('.CardScroll').length).toEqual(1)
    // TODO: expect(component.find('VideoAdd').length).toEqual(1)
  })

  describe('ListHeader', () => {
    let ListHeader
    let input

    beforeEach(() => {
      ListHeader = component.find('.ListHeader')
      input = component.find('input')
    })

    it('renders itself', () => {
      expect(ListHeader.length).toEqual(1)
    })

    it('has an input', () => {
      expect(input.length).toEqual(1)
      expect(input.props().type).toEqual('text')
      expect(ListHeader.find('.BtnTrash').length).toEqual(1)
      expect(ListHeader.find('.HelpBlock').length).toEqual(0)
    })

    // it('changes the text if user types text', () => {
    //   const value = `Surfing /?#[]@!$&'()*+,;= in Uluwatu  `
    //   input.simulate('change', { target: { value } })
    //   input.simulate('keyPress', { key: 'Enter' })
    //   expect(input.get(0).value).toBe(value)
    // })

    // it('edits list with slug if user presses enter key', () => {
    //   const value = `Surfing /?#[]@!$&'()*+,;= in Uluwatu  `
    //   const name = `Surfing /?#[]@!$&'()*+,;= in Uluwatu`
    //   const slug = `surfing-in-uluwatu`
    //   input.simulate('change', { target: { value } })
    //   expect(component.find('.HelpBlock').length).toEqual(0)
    //   input.simulate('keyPress', { key: 'Enter' })
    //   expect(props.addList).toHaveBeenCalledWith({ name, slug }, props.board.slug)
    //   expect(component.find('.HelpBlock').length).toEqual(0)
    // })

    // it('does not edit and shows error if user types existing list name', () => {
    //   input.simulate('change', { target: { value: 'psy' } })
    //   expect(component.find('.HelpBlock').text()).toBe(ERROR_MESSAGE.exists)
    //   input.simulate('keyPress', { key: 'Enter' })
    //   expect(props.addList).not.toHaveBeenCalled()
    //   expect(input.get(0).value).toBe('psy')
    //   expect(component.find('.HelpBlock').text()).toBe(ERROR_MESSAGE.exists)
    // })
  })
})
