import React from 'react'
import { connect } from 'react-redux'
import { fetchStorage, pushStorage } from '../actions/index'
import 'normalize.css'
import '../style/reboot.css'
import '../style/type.css'
import '../style/forms.css'
import '../style/buttons.css'
import '../style/card.css'
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
  fetchStorage: () => console.log('fetchStorage not defined'),
  pushStorage: () => console.log('pushStorage not defined')
}

class Index extends React.Component {
  componentWillMount() {
    this.props.fetchStorage()
  }

  componentDidUpdate(prevProps) {
    this.props.pushStorage(this.props.videoStorage, prevProps.videoStorage)
  }

  render() {
    const currentVideoStorage = this.props.videoStorage

    return (
      <div className="AppContainer">
        <AppHeader />

        <section className="AppWrapper">
          <AppSidebar boardsList={currentVideoStorage.boards} />
          <main className="AppMain">{this.props.children}</main>
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
