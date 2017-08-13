import { createStore, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import reducer from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createHistory()

export default createStore(
  reducer,
  composeEnhancers(applyMiddleware(reduxThunk, routerMiddleware(history)))
)
