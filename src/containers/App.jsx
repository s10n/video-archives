import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchBoards, fetchVideos, pushStorage } from '../actions'
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

const propTypes = {
  boards: React.PropTypes.object.isRequired,
  videos: React.PropTypes.object.isRequired,
  fetchBoards: React.PropTypes.func.isRequired,
  pushStorage: React.PropTypes.func.isRequired
}

const defaultProps = {
  boards: {},
  videos: {},
  fetchBoards: () => console.warn('fetchBoards not defined'),
  pushStorage: () => console.warn('pushStorage not defined')
}

class App extends React.Component {
  componentWillMount() {
    const localBoards = localStorage.boards && JSON.parse(localStorage.boards)
    const localVideos = localStorage.videos && JSON.parse(localStorage.videos)
    this.props.fetchBoards(localBoards)
    this.props.fetchVideos(localVideos)
  }

  componentDidUpdate(prevProps) {
    this.props.pushStorage(this.props, prevProps)
  }

  render() {
    const { boards, videos } = this.props
    const trash = _.find(videos, 'deleted') && true

    return (
      <div className="AppContainer">
        <AppHeader />

        <section className="AppWrapper">
          <AppSidebar boardsList={boards} trash={trash} />
          <main className="AppMain">
            <div className="PageWrapper">{this.props.children}</div>
          </main>
        </section>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { boards: state.boards, videos: state.videos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchBoards, fetchVideos, pushStorage }, dispatch)
}

App.propTypes = propTypes
App.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(App)
