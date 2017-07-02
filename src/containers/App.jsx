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
import '../style/card.css'
import '../style/page.css'
import './App.css'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'
import AppMain from './AppMain'

export const history = createHistory()

const propTypes = {
  boards: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  fetchBoards: PropTypes.func.isRequired,
  pushStorage: PropTypes.func.isRequired
}

const defaultProps = {
  boards: {},
  videos: {},
  authenticated: false,
  fetchBoards: () => console.warn('fetchBoards not defined'),
  pushStorage: () => console.warn('pushStorage not defined')
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
    const trash = _.find(videos, 'deleted') && true

    return (
      <ConnectedRouter history={history}>
        <div className="AppContainer">
          <AppHeader />

          <section className="AppWrapper">
            <AppSidebar boards={boards} trash={trash} />
            <AppMain />
          </section>
        </div>
      </ConnectedRouter>
    )
  }
}

function mapStateToProps(state) {
  return { boards: state.boards, videos: state.videos, authenticated: state.auth.authenticated }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchBoards, fetchVideos, pushStorage }, dispatch)
}

App.propTypes = propTypes
App.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(App)
