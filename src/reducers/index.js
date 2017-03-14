import { combineReducers } from 'redux'
import boards from './ReducerBoards'
import videos from './ReducerVideos'

const rootReducer = combineReducers({ boards, videos })

export default rootReducer
