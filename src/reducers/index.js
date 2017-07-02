import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import auth from './authReducer'
import boards from './boardsReducer'
import videos from './videosReducer'

const rootReducer = combineReducers({ auth, boards, videos, router, form })

export default rootReducer
