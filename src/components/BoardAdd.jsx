import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addBoard } from '../actions/board'
import { errorMessages, reservedBoardSlug } from '../constants/app'
import { slugify } from '../constants/utils'
import './BoardAdd.css'

const propTypes = {
  boards: PropTypes.object.isRequired,
  addBoard: PropTypes.func.isRequired
}

class BoardAdd extends Component {
  constructor(props) {
    super(props)

    this.state = { title: '', slug: '', error: null }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePressEnter = this.handlePressEnter.bind(this)
  }

  handleInputChange(title) {
    const { boards } = this.props
    const slug = slugify(title)
    const isBoardExists = _.findKey(boards, ['slug', slug])
    const isSlugReserved = reservedBoardSlug.includes(slug)

    let error = null
    if (isBoardExists) error = errorMessages.board.exists
    if (isSlugReserved) error = errorMessages.board.reserved

    this.setState({ title, slug, error })
  }

  handlePressEnter() {
    const title = this.state.title.trim()
    const { slug, error } = this.state

    if (title && slug && !error) {
      this.props.addBoard({ title, slug })
      this.setState({ title: '', slug: '' })
    }
  }

  render() {
    const { title, error } = this.state

    return (
      <section className="BoardAdd">
        <input
          className="borderless-input"
          type="text"
          onChange={event => this.handleInputChange(event.target.value)}
          onKeyPress={event => event.key === 'Enter' && this.handlePressEnter()}
          value={title}
          placeholder="Create new board..."
        />

        {title.length > 0 &&
          <p className="HelpBlock">
            <small>
              {error || errorMessages.board.valid}
            </small>
          </p>}
      </section>
    )
  }
}

BoardAdd.propTypes = propTypes

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ addBoard }, dispatch)
}

export default connect(null, mapDispatchToProps)(BoardAdd)
