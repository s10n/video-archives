import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import reducers from './reducers'
import types from './constants/types'
import { auth } from './constants/api'
import App, { history } from './containers/App'

const middleware = routerMiddleware(history)
const createStoreWithMiddleware = applyMiddleware(reduxThunk, middleware)(createStore)
const store = createStoreWithMiddleware(reducers)

auth().onAuthStateChanged(user => {
  user
    ? store.dispatch({ type: types.AUTH_USER, user })
    : store.dispatch({ type: types.UNAUTH_USER })

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  )
})
