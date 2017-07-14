import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import createHistory from 'history/createHashHistory'
import { ConnectedRouter } from 'react-router-redux'
import { fetchBoards } from '../actions/board'
import { fetchVideos } from '../actions/video'
import { pushStorage } from '../actions/storage'
import 'normalize.css'
import '../style/reboot.css'
import '../style/type.css'
import '../style/forms.css'
import '../style/buttons.css'
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

class App extends React.Component {
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

export default connect(mapStateToProps, mapDispatchToProps)(App)
