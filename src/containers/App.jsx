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
import { pushStorage } from '../actions/storage'
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
  boards: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
  fetchBoards: PropTypes.func.isRequired,
  pushStorage: PropTypes.func.isRequired
}

class App extends Component {
  componentWillMount() {
    this.props.fetchBoards()
    this.props.fetchVideos()
  }

  componentDidUpdate(prevProps) {
    this.props.pushStorage(this.props, prevProps)
  }

  render() {
    const { boards, videos } = this.props
    const trash = _.filter(videos, 'deleted').length

    return (
      <ConnectedRouter history={history}>
        <div className="App">
          <AppHeader />

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

function mapStateToProps({ boards, videos }) {
  return { boards, videos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchBoards, fetchVideos, pushStorage }, dispatch)
}

const enhance = _.flow(DragDropContext(HTML5Backend), connect(mapStateToProps, mapDispatchToProps))

export default enhance(App)
