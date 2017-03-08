import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { addList } from '../actions/index'
import './BoardRead.css'
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
      <section className="BoardRead">
        <h1 className="BoardTitle">{this.props.params.boardName}</h1>


        <div className="BoardCanvas">
          <div className="BoardScroll">
            {currentBoard.lists.map(list => {
              return (
                <div className="VideoWrapper" key={list}>
                  <VideoList listName={list} videoList={currentVideoStorage.videos} />
                </div>
              )
            })}

            <div className="VideoWrapper">
              <article className="VideoList card">
                <input
                  className="ListAddInput card-title"
                  onChange={event => this.setState({ newListName: event.target.value })}
                  onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
                  value={this.state.newListName}
                  placeholder="Add a list..."
                />
              </article>
            </div>
          </div>
        </div>
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
