import React from 'react'
import { Link } from 'react-router'

const propTypes = {
  boardsList: React.PropTypes.array.isRequired,
  onSubmitBoard: React.PropTypes.func.isRequired
}

const defaultProps = {
  boardsList: [],
  onSubmitBoard: () => console.error('onSubmitBoard not defined')
}

class VideoSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { newBoardName: '' }
    this.onPressEnter = this.onPressEnter.bind(this)
  }

  onPressEnter() {
    const name = this.state.newBoardName

    if (name) {
      this.props.onSubmitBoard(name)
    } else {
      console.log('Board name is required')
    }

    this.setState({ newBoardName: '' })
  }

  render() {
    return (
      <nav>
        <div className="list-group">
          {this.props.boardsList.map(item => {return (
            <Link
              className="list-group-item list-group-item-action"
              to={`${item.name}`}
              key={item.name}>{item.name}</Link>
          )})}
        </div>

        <input
          className="form-control"
          onChange={event => this.setState({ newBoardName: event.target.value })}
          onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
          value={this.state.newBoardName}
          placeholder="Create new board" />
      </nav>
    )
  }
}

VideoSidebar.propTypes = propTypes
VideoSidebar.defaultProps = defaultProps

export default VideoSidebar
