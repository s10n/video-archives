import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import reducers from './reducers'
import { AUTH_USER, UNAUTH_USER } from './actions/types'
import { auth } from './config/constants'
import App, { history } from './containers/App'

const middleware = routerMiddleware(history)
const createStoreWithMiddleware = applyMiddleware(reduxThunk, middleware)(createStore)
const store = createStoreWithMiddleware(reducers)

auth().onAuthStateChanged(user => {
  user ? store.dispatch({ type: AUTH_USER }) : store.dispatch({ type: UNAUTH_USER })

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  )
})
