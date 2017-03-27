import React from 'react'
import { mount } from 'enzyme'
import { BoardAdd, ERROR_MESSAGE } from './BoardAdd'
import { SAMPLE_BOARDS } from '../reducers/SampleStorage.js'

describe('BoardAdd', () => {
  let props, context, component, input

  beforeEach(() => {
    props = { boards: SAMPLE_BOARDS, addBoard: jest.fn() }
    context = { router: { push: jest.fn() } }
    component = mount(<BoardAdd {...props} />, { context })
    input = component.find('input')
  })

  it('renders itself', () => {
    expect(component.length).toEqual(1)
  })

  it('has an input', () => {
    expect(input.length).toEqual(1)
    expect(input.props().type).toEqual('text')
    expect(input.props().placeholder).toBe('Create new board...')
    expect(component.find('.HelpBlock').length).toEqual(0)
  })

  it('changes the text if user types text', () => {
    const value = `Gaming /?#[]@!$&'()*+,;= trailer  `
    input.simulate('change', { target: { value } })
    expect(input.get(0).value).toBe(value)
  })

  it('saves new board with slug if user presses enter key', () => {
    const value = `Gaming /?#[]@!$&'()*+,;= trailer  `
    const title = `Gaming /?#[]@!$&'()*+,;= trailer`
    const slug = `gaming-trailer`
    input.simulate('change', { target: { value } })
    expect(component.find('.HelpBlock').text()).toBe(ERROR_MESSAGE.valid)
    input.simulate('keyPress', { key: 'Enter' })
    expect(props.addBoard).toHaveBeenCalledWith({ title, slug })
    expect(component.find('.HelpBlock').length).toEqual(0)
  })

  it('does not save and shows error if user types Trash', () => {
    input.simulate('change', { target: { value: 'Trash' } })
    expect(component.find('.HelpBlock').text()).toBe(ERROR_MESSAGE.reserved)
    input.simulate('keyPress', { key: 'Enter' })
    expect(props.addBoard).not.toHaveBeenCalled()
    expect(input.get(0).value).toBe('Trash')
    expect(component.find('.HelpBlock').text()).toBe(ERROR_MESSAGE.reserved)
  })

  it('does not save shows error if user types existing board title', () => {
    input.simulate('change', { target: { value: 'Music' } })
    expect(component.find('.HelpBlock').text()).toBe(ERROR_MESSAGE.exists)
    input.simulate('keyPress', { key: 'Enter' })
    expect(props.addBoard).not.toHaveBeenCalled()
    expect(input.get(0).value).toBe('Music')
    expect(component.find('.HelpBlock').text()).toBe(ERROR_MESSAGE.exists)
  })
})
