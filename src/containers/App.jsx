import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { fetchStorage, pushStorage } from '../actions'
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
  videoStorage: React.PropTypes.object.isRequired,
  fetchStorage: React.PropTypes.func.isRequired,
  pushStorage: React.PropTypes.func.isRequired
}

const defaultProps = {
  videoStorage: {},
  fetchStorage: () => console.warn('fetchStorage not defined'),
  pushStorage: () => console.warn('pushStorage not defined')
}

class Index extends React.Component {
  componentWillMount() {
    this.props.fetchStorage()
  }

  componentDidUpdate(prevProps) {
    this.props.pushStorage(this.props.videoStorage, prevProps.videoStorage)
  }

  render() {
    const videoStorage = this.props.videoStorage
    const trash = _.find(videoStorage.videos, video => {return video.deleted}) ? true : false

    return (
      <div className="AppContainer">
        <AppHeader />

        <section className="AppWrapper">
          <AppSidebar boardsList={videoStorage.boards} trash={trash} />
          <main className="AppMain">
            <div className="PageWrapper">{this.props.children}</div>
          </main>
        </section>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { videoStorage: state.videoStorage }
}

Index.propTypes = propTypes
Index.defaultProps = defaultProps

export default connect(mapStateToProps, { fetchStorage, pushStorage })(Index)
