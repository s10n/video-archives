import React from 'react'
import { connect } from 'react-redux'
import { fetchStorage, pushStorage } from '../actions/index'
import Sidebar from './Sidebar'
import VideoAdd from '../components/VideoAdd'
import '../App.css'

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
      <div className="container-fluid" style={{ marginTop: '15px' }}>
        <div className="row">
          <div className="col-sm-3">
            <Sidebar boardsList={currentVideoStorage.boards} />
          </div>
          <div className="col-sm-9">
            <main>
              {this.props.children}
              <VideoAdd />
            </main>
          </div>
        </div>
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
