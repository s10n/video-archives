import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { fetchBoards } from '../actions/board'
import { fetchVideos } from '../actions/video'
import { setStorage } from '../constants/utils'
import '../style/reboot.css'
import '../style/type.css'
import '../style/forms.css'
import '../style/buttons.css'
import '../style/dnd.css'
import './App.css'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'
import AppMain from './AppMain'

export const history = createHistory()

const propTypes = {
  app: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  boards: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
  fetchBoards: PropTypes.func.isRequired,
  fetchVideos: PropTypes.func.isRequired
}

class App extends Component {
  componentWillMount() {
    this.props.fetchBoards()
    this.props.fetchVideos()
  }

  componentDidUpdate(prevProps) {
    setStorage(this.props, prevProps)
  }

  render() {
    const { app, auth, boards, videos } = this.props
    const trash = _.filter(videos, 'deleted').length

    return (
      <ConnectedRouter history={history}>
        <div className="App">
          <AppHeader status={app.status} authenticated={auth.authenticated} user={auth.user} />

          <section className="AppContainer">
            <AppSidebar boards={boards} videos={videos} trash={trash} />
            <AppMain />
          </section>
        </div>
      </ConnectedRouter>
    )
  }
}

App.propTypes = propTypes

const mapStateToProps = ({ app, auth, boards, videos }) => {
  return { app, auth, boards, videos }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchBoards, fetchVideos }, dispatch)
}

const enhance = _.flow(DragDropContext(HTML5Backend), connect(mapStateToProps, mapDispatchToProps))

export default enhance(App)
