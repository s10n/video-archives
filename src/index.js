import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { Router, hashHistory } from 'react-router'
import reducers from './reducers'
import routes from './routes'
import { AUTH_USER, UNAUTH_USER } from './actions/types'
import * as firebase from 'firebase'
import { firebaseConfig } from './config'

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(reducers)

firebase.initializeApp(firebaseConfig)
firebase.auth().onAuthStateChanged(user => {
  user ? store.dispatch({ type: AUTH_USER }) : store.dispatch({ type: UNAUTH_USER })
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
)
