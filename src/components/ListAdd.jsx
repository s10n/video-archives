import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addList } from '../actions/list'
import { errorMessages, slugify } from '../config/constants'
import Card from './Card'

const propTypes = {
  board: PropTypes.object.isRequired,
  addList: PropTypes.func.isRequired
}

class ListAdd extends Component {
  constructor(props) {
    super(props)

    this.state = { name: '', slug: '', error: null }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePressEnter = this.handlePressEnter.bind(this)
  }

  handleInputChange(name) {
    const { board } = this.props
    const slug = slugify(name)
    const isListExists = _.findKey(board.lists, ['slug', slug])
    const error = isListExists && errorMessages.list.exists

    this.setState({ name, slug, error })
  }

  handlePressEnter() {
    const name = this.state.name.trim()
    const { slug, error } = this.state

    if (name && slug && !error) {
      const { board, addList } = this.props
      const list = { name, slug }
      addList(board.key, list)
      this.setState({ name: '', slug: '', error: null })
    }
  }

  render() {
    const { name, error } = this.state

    const header = (
      <div>
        <input
          type="text"
          className="borderless-input"
          onChange={event => this.handleInputChange(event.target.value)}
          onKeyPress={event => event.key === 'Enter' && this.handlePressEnter()}
          value={name}
          placeholder="Add a list..."
        />

        {error &&
          <small className="HelpBlock">
            {error}
          </small>}
      </div>
    )

    return <Card header={header} />
  }
}

ListAdd.propTypes = propTypes

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addList }, dispatch)
}

export default connect(null, mapDispatchToProps)(ListAdd)
