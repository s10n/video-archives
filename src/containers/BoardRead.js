import _ from 'lodash'
import React from 'react'
import VideoList from '../components/VideoList'

class BoardRead extends React.Component {
  // TODO: Remove repeated videoStorage
  constructor(props) {
    super(props)
    this.state = { newListName: '', videoStorage: {} }
    this.onPressEnter = this.onPressEnter.bind(this)
  }

  componentWillMount() {
    const localVideoStorage = localStorage.videoStorage

    if (localVideoStorage) {
      this.setState({
        newListName: this.state.newListName,
        videoStorage: JSON.parse(localVideoStorage)
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const currentVideoStorage = this.state.videoStorage

    if (JSON.stringify(prevState.videoStorage) !== JSON.stringify(currentVideoStorage)) {
      localStorage.videoStorage = JSON.stringify(currentVideoStorage)
    }
  }

  onPressEnter() {
    // TODO: Can not refresh parent component
    // TODO: setState syntax too complicated
    const name = this.state.newListName
    const currentVideoStorage = this.state.videoStorage
    const currentBoardName = this.props.params.boardName
    const currentBoard = _.find(currentVideoStorage.boards, o => {return o.name === currentBoardName})

    if (name) {
      if (currentBoard.lists.indexOf(name) === -1) {
        this.setState({
          newListName: '',
          videoStorage: {
            boards: currentVideoStorage.boards.map(board => {
              if (board === currentBoard) {
                return { name: board.name, lists: [ ...board.lists, name ] }
              } else {
                return board
              }
            }),
            videos: currentVideoStorage.videos
          }
        })
      } else {
        console.log('FAIL: List exists')
      }
    } else {
      console.log('List name is required')
    }
  }

  render() {
    const currentVideoStorage = this.state.videoStorage
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

export default BoardRead
