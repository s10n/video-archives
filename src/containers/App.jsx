import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
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
  boards: React.PropTypes.array.isRequired,
  videos: React.PropTypes.array.isRequired,
  fetchBoards: React.PropTypes.func.isRequired,
  pushStorage: React.PropTypes.func.isRequired
}

const defaultProps = {
  boards: [],
  videos: [],
  fetchBoards: () => console.warn('fetchBoards not defined'),
  pushStorage: () => console.warn('pushStorage not defined')
}

class Index extends React.Component {
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

Index.propTypes = propTypes
Index.defaultProps = defaultProps

export default connect(mapStateToProps, { fetchBoards, fetchVideos, pushStorage })(Index)
