import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addBoard } from '../actions'
import './BoardAdd.css'

export const ERROR_MESSAGE = {
  valid: 'Press enter key to create ↵',
  reserved: 'Reserved board title',
  exists: 'Board already exists'
}

const propTypes = {
  boards: React.PropTypes.object.isRequired,
  addBoard: React.PropTypes.func.isRequired
}

const defaultProps = {
  boards: {},
  addBoard: () => console.warn('addBoard not defined')
}

export class BoardAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = { title: '', slug: '', error: null }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePressEnter = this.handlePressEnter.bind(this)
  }

  handleInputChange(event) {
    const title = event.target.value
    const slug = title.trim().toString().toLowerCase().replace(/\s+/g, '-')
      .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=/g, '-').replace(/--+/g, '-')
    let error = null

    if (slug === 'trash') {
      error = ERROR_MESSAGE.reserved
    } else if (_.find(this.props.boards, ['slug', slug])) {
      error = ERROR_MESSAGE.exists
    }

    this.setState({ title, slug, error })
  }

  handlePressEnter() {
    const title = this.state.title.trim()
    const { slug, error } = this.state

    if (title && slug && !error) {
      const board = { title, slug }
      this.props.addBoard(board)
      this.setState({ title: '', slug: '' })
    }
  }

  render() {
    return (
      <section className="BoardAdd">
        <input
          className="borderless-input"
          type="text"
          onChange={this.handleInputChange}
          onKeyPress={event => {(event.key === 'Enter') && this.handlePressEnter()}}
          value={this.state.title}
          placeholder="Create new board..."
        />

        {this.state.title.length > 0 &&
          <p className="HelpBlock">
            <small>{this.state.error || ERROR_MESSAGE.valid}</small>
          </p>
        }
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { boards: state.boards }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addBoard }, dispatch)
}

BoardAdd.propTypes = propTypes
BoardAdd.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(BoardAdd)
