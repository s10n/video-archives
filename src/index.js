import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Raven from 'raven-js'
import store from './store'
import types from './constants/types'
import { auth } from './constants/api'
import App from './containers/App'

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
