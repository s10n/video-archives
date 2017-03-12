import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { addList } from '../actions/index'
import './ListAdd.css'

const propTypes = {
  board: React.PropTypes.object.isRequired,
  addList: React.PropTypes.func.isRequired
}

const defaultProps = {
  boardSlug: {},
  addList: () => console.log('addList not defined')
}

class ListAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: '', slug: '', error: null }
    this.onInputChange = this.onInputChange.bind(this)
    this.onPressEnter = this.onPressEnter.bind(this)
  }

  onInputChange(event) {
    const name = event.target.value
    const slug = name.trim().toString().toLowerCase().replace(/\s+/g, '-')
      .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=/g, '-').replace(/\-\-+/g, '-')
    const listExists = _.find(this.props.board.lists, list => {return list.slug === slug})

    this.setState({ name, slug, error: listExists && 'List exists' })
  }

  onPressEnter() {
    const board = this.props.board
    const name = this.state.name.trim()
    const { slug, error } = this.state

    if (name && slug && !error) {
      const list = { name, slug }
      this.props.addList(list, board)
      this.setState({ name: '', slug: '', error: null })
    }
  }

  render() {
    return (
      <div>
        <input
          className="CardTitle"
          onChange={this.onInputChange}
          onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
          value={this.state.name}
          placeholder="Add a list..."
        />

        {this.state.error &&
          <small className="HelpBlock">{this.state.error}</small>
        }
      </div>
    )
  }
}

ListAdd.propTypes = propTypes
ListAdd.defaultProps = defaultProps

export default connect(null, { addList })(ListAdd)
