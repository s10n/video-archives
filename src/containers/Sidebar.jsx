import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { addBoard } from '../actions/index'

const propTypes = {
  boardsList: React.PropTypes.array.isRequired,
  addBoard: React.PropTypes.func.isRequired
}

const defaultProps = {
  boardsList: [],
  addBoard: () => console.error('addBoard not defined')
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
      this.props.addBoard(name)
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

export default connect(null, { addBoard })(VideoSidebar)
