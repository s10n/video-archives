import React from 'react'

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
  }

  render() {
    const navStyle = {
      backgroundColor: 'hsl(0, 0%, 95%)',
      marginBottom: '5px',
      padding: '15px'
    }

    return (
      <nav style={navStyle}>
        <ul>
          {this.props.boardsList.map(item => {return (<li key={item}><a href>{item}</a></li>)})}
        </ul>

        <input
          onChange={event => this.setState({ newBoardName: event.target.value })}
          onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
          value={this.state.newBoardName} />
      </nav>
    )
  }
}

VideoSidebar.propTypes = propTypes
VideoSidebar.defaultProps = defaultProps

export default VideoSidebar
