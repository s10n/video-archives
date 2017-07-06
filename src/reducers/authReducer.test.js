import auth from './ReducerAuth'
import * as types from '../actions/types'

describe('Auth reducer', () => {
  it('should return the initial state', () => {
    const action = {}
    expect(auth(undefined, action)).toEqual({})
  })

  it('should handle AUTH_USER', () => {
    const action = { type: types.AUTH_USER }
    expect(auth({}, action)).toEqual({ error: '', authenticated: true })
  })

  it('should handle UNAUTH_USER', () => {
    const action = { type: types.UNAUTH_USER }
    expect(auth({}, action)).toEqual({ authenticated: false })
  })

  it('should handle AUTH_ERROR', () => {
    const action = { type: types.AUTH_ERROR, payload: 'Error Message' }
    expect(auth({}, action)).toEqual({ error: 'Error Message' })
  })
})
