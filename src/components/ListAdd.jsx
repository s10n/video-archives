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
    this.state = { name: '', slug: '' }
    this.onInputChange = this.onInputChange.bind(this)
    this.onPressEnter = this.onPressEnter.bind(this)
  }

  onInputChange(event) {
    const name = event.target.value
    this.setState({ name })
  }

  onPressEnter() {
    const boardSlug = this.props.boardSlug
    const name = this.state.name.trim()
    const slug = name.toString().toLowerCase().replace(/\s+/g, '-')

    if (name && slug) {
      const newList = { name, slug }
      this.props.addList(newList, boardSlug)
    } else {
      console.log('List name is required')
    }

    this.setState({ name: '', slug: '' })
  }

  render() {
    return (
      <input
        className="CardTitle"
        onChange={this.onInputChange}
        onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
        value={this.state.name}
        placeholder="Add a list..."
      />
    )
  }
}

ListAdd.propTypes = propTypes
ListAdd.defaultProps = defaultProps

export default connect(null, { addList })(ListAdd)
