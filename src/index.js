import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import Raven from 'raven-js'
import reducer from './reducers'
import types from './constants/types'
import { auth } from './constants/api'
import App, { history } from './containers/App'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(reduxThunk, routerMiddleware(history)))
)

process.env.REACT_APP_ENV === 'production' &&
  Raven.config('https://6e6f68aaf3a14526aa3880cf5353b7b1@sentry.io/200634').install()

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
