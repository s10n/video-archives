import { combineReducers } from 'redux'
import videosReducer from './ReducerVideos'

const rootReducer = combineReducers({
  videoStorage: videosReducer
})

export default rootReducer
