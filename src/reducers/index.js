import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import auth from './ReducerAuth'
import boards from './ReducerBoards'
import videos from './ReducerVideos'

const rootReducer = combineReducers({ auth, boards, videos, router, form })

export default rootReducer
