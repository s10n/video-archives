import React from 'react'
import { connect } from 'react-redux'
import { addList } from '../actions/index'
import './ListAdd.css'

const propTypes = {
  boardSlug: React.PropTypes.string.isRequired,
  addList: React.PropTypes.func.isRequired
}

const defaultProps = {
  boardSlug: '',
  addList: () => console.log('addList not defined')
}

class ListAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = { newListName: '' }
    this.onPressEnter = this.onPressEnter.bind(this)
  }

  onPressEnter() {
    const name = this.state.newListName
    const boardSlug = this.props.boardSlug

    if (name) {
      this.props.addList(name, boardSlug)
      this.setState({ newListName: '' })
    } else {
      console.log('List name is required')
    }
  }

  render() {
    return (
      <input
        className="ListAddInput card-title"
        onChange={event => this.setState({ newListName: event.target.value })}
        onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
        value={this.state.newListName}
        placeholder="Add a list..."
      />
    )
  }
}

ListAdd.propTypes = propTypes
ListAdd.defaultProps = defaultProps

export default connect(null, { addList })(ListAdd)
