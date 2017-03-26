import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addBoard } from '../actions'
import './BoardAdd.css'

const propTypes = {
  boards: React.PropTypes.array.isRequired,
  addBoard: React.PropTypes.func.isRequired
}

const defaultProps = {
  boards: [],
  addBoard: () => console.warn('addBoard not defined')
}

class BoardAdd extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = { title: '', slug: '', error: null }
    this.onInputChange = this.onInputChange.bind(this)
    this.onPressEnter = this.onPressEnter.bind(this)
  }

  onInputChange(event) {
    const title = event.target.value
    const slug = title.trim().toString().toLowerCase().replace(/\s+/g, '-')
      .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=/g, '-').replace(/--+/g, '-')
    let error = null

    if (slug === 'trash') {
      error = 'Reserved board title'
    } else if (_.find(this.props.boards, ['slug', slug])) {
      error = 'Board already exists'
    }

    this.setState({ title, slug, error })
  }

  onPressEnter() {
    const title = this.state.title.trim()
    const { slug, error } = this.state

    if (title && slug && !error) {
      const board = { title, slug }
      this.props.addBoard(board)
      this.context.router.push(slug)
      this.setState({ title: '', slug: '' })
    }
  }

  render() {
    return (
      <section className="BoardAdd">
        <input
          type="text"
          onChange={this.onInputChange}
          onKeyPress={event => {(event.key === 'Enter') && this.onPressEnter()}}
          value={this.state.title}
          placeholder="Create new board..."
        />

        {this.state.title.length > 0 &&
          <p className="HelpBlock">
            <small>{this.state.error || `Press enter key to create ↵`}</small>
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
