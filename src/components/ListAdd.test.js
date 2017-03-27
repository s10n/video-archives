import React from 'react'
import { mount } from 'enzyme'
import { ListAdd, ERROR_MESSAGE } from './ListAdd'
import { SAMPLE_BOARDS } from '../reducers/SampleStorage'

describe('ListAdd', () => {
  let props, context, component, input

  beforeEach(() => {
    props = { board: SAMPLE_BOARDS[1], addList: jest.fn() }
    component = mount(<ListAdd {...props} />)
    input = component.find('input')
  })

  it('renders itself', () => {
    expect(component.length).toEqual(1)
  })

  it('has an input', () => {
    expect(input.length).toEqual(1)
    expect(input.props().type).toEqual('text')
    expect(input.props().placeholder).toBe('Add a list...')
    expect(component.find('.HelpBlock').length).toEqual(0)
  })

  it('changes the text if user types text', () => {
    const value = `Surfing /?#[]@!$&'()*+,;= in Uluwatu  `
    input.simulate('change', { target: { value } })
    expect(input.get(0).value).toBe(value)
  })

  it('saves new list with slug if user presses enter key', () => {
    const value = `Surfing /?#[]@!$&'()*+,;= in Uluwatu  `
    const name = `Surfing /?#[]@!$&'()*+,;= in Uluwatu`
    const slug = `surfing-in-uluwatu`
    input.simulate('change', { target: { value } })
    expect(component.find('.HelpBlock').length).toEqual(0)
    input.simulate('keyPress', { key: 'Enter' })
    expect(props.addList).toHaveBeenCalledWith({ name, slug }, props.board.slug)
    expect(component.find('.HelpBlock').length).toEqual(0)
  })

  it('does not save and shows error if user types existing list name', () => {
    input.simulate('change', { target: { value: 'water' } })
    expect(component.find('.HelpBlock').text()).toBe(ERROR_MESSAGE.exists)
    input.simulate('keyPress', { key: 'Enter' })
    expect(props.addList).not.toHaveBeenCalled()
    expect(input.get(0).value).toBe('water')
    expect(component.find('.HelpBlock').text()).toBe(ERROR_MESSAGE.exists)
  })
})
