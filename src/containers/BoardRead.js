import React from 'react'

class BoardRead extends React.Component {
  constructor(props) {
    super(props)
    this.state = { newListName: '' }
    this.onPressEnter = this.onPressEnter.bind(this)
  }

  componentWillMount() {
    const localVideoStorage = localStorage.videoStorage

    if (localVideoStorage) {
      this.setState({ videoStorage: JSON.parse(localVideoStorage) })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const currentVideoStorage = this.state.videoStorage

    if (JSON.stringify(prevState.videoStorage) !== JSON.stringify(currentVideoStorage)) {
      localStorage.videoStorage = JSON.stringify(currentVideoStorage)
    }
  }

  onPressEnter() {
    const name = this.state.newListName

    if (name) {
      console.log(name)
    } else {
      console.log('List name is required')
    }
  }

  render() {
    return (
      <section>
        <h1>{this.props.params.boardName}</h1>

        <input
          onChange={event => this.setState({ newListName: event.target.value })}
          onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
          value={this.state.newListName} />
      </section>
    )
  }
}

export default BoardRead
