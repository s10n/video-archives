import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import app from './appReducer'
import auth from './authReducer'
import boards from './boardsReducer'
import videos from './videosReducer'

export default combineReducers({ app, auth, boards, videos, router, form })
