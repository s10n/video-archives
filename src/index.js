import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxPromise from 'redux-promise'
import { Router, hashHistory } from 'react-router'
import reducers from './reducers'
import routes from './routes'
import * as firebase from 'firebase'
import { firebaseConfig } from './config'

firebase.initializeApp(firebaseConfig)

const createStoreWithMiddleware = applyMiddleware(
  ReduxPromise
)(createStore)

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={hashHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
)
