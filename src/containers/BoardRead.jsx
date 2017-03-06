import _ from 'lodash'
import { connect } from 'react-redux'
import { addList } from '../actions/index'
import React from 'react'
import VideoList from '../components/VideoList'

const propTypes = {
  videoStorage: React.PropTypes.object.isRequired,
  addList: React.PropTypes.func.isRequired
}

const defaultProps = {
  videoStorage: {},
  addList: () => console.log('addList not defined')
}

class BoardRead extends React.Component {
  constructor(props) {
    super(props)
    this.state = { newListName: '' }
    this.onPressEnter = this.onPressEnter.bind(this)
  }

  onPressEnter() {
    const name = this.state.newListName
    const currentBoardName = this.props.params.boardName

    if (name) {
      this.props.addList(name, currentBoardName)
      this.setState({ newListName: '' })
    } else {
      console.log('List name is required')
    }
  }

  render() {
    const currentVideoStorage = this.props.videoStorage
    const currentBoardName = this.props.params.boardName
    const currentBoard = _.find(currentVideoStorage.boards, o => {return o.name === currentBoardName})

    return (
      <section>
        <h1>{this.props.params.boardName}</h1>

        <section className="row">
          {currentBoard.lists.map(list => {
            return (
              <div className="col-sm-4" key={list}>
                <VideoList listName={list} videoList={currentVideoStorage.videos} />
              </div>
            )
          })}

          <div className="col-sm-4">
            <input
              className="form-control"
              onChange={event => this.setState({ newListName: event.target.value })}
              onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
              value={this.state.newListName}
              placeholder="Add a list" />
          </div>
        </section>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { videoStorage: state.videoStorage }
}

BoardRead.propTypes = propTypes
BoardRead.defaultProps = defaultProps

export default connect(mapStateToProps, { addList })(BoardRead)
