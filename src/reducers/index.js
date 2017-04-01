import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import boards from './ReducerBoards'
import videos from './ReducerVideos'

const rootReducer = combineReducers({ boards, videos, form })

export default rootReducer
