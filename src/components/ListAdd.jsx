import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addList } from '../actions'
import './ListAdd.css'

export const ERROR_MESSAGE = {
  exists: 'List exists'
}

const propTypes = {
  board: React.PropTypes.object.isRequired,
  addList: React.PropTypes.func.isRequired
}

const defaultProps = {
  board: {},
  addList: () => console.warn('addList not defined')
}

export class ListAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: '', slug: '', error: null }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePressEnter = this.handlePressEnter.bind(this)
  }

  handleInputChange(event) {
    const name = event.target.value
    const slug = name.trim().toString().toLowerCase().replace(/\s+/g, '-')
      .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=/g, '-').replace(/--+/g, '-')
    const listExists = _.find(this.props.board.lists, ['slug', slug])

    this.setState({ name, slug, error: listExists && ERROR_MESSAGE.exists })
  }

  handlePressEnter() {
    const board = this.props.board
    const name = this.state.name.trim()
    const { slug, error } = this.state

    if (name && slug && !error) {
      const list = { name, slug }
      this.props.addList(list, board.slug)
      this.setState({ name: '', slug: '', error: null })
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          className="CardTitle"
          onChange={this.handleInputChange}
          onKeyPress={event => {(event.key === 'Enter') && this.handlePressEnter()}}
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addList }, dispatch)
}

ListAdd.propTypes = propTypes
ListAdd.defaultProps = defaultProps

export default connect(null, mapDispatchToProps)(ListAdd)
