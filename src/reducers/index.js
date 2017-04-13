import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import auth from './ReducerAuth'
import boards from './ReducerBoards'
import videos from './ReducerVideos'

const rootReducer = combineReducers({ auth, boards, videos, form })

export default rootReducer
