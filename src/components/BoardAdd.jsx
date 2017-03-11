import React from 'react'
import { connect } from 'react-redux'
import { addBoard } from '../actions/index'
import './BoardAdd.css'

const propTypes = {
  addBoard: React.PropTypes.func.isRequired
}

const defaultProps = {
  addBoard: () => console.error('addBoard not defined')
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
    this.setState({ title, slug, error: slug === 'trash' && 'Reserved board title' })
  }

  onPressEnter() {
    const title = this.state.title.trim()
    const { slug, error } = this.state

    if (title && slug && !error) {
      const newBoard = { title, slug }
      this.props.addBoard(newBoard)
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
          onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
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

BoardAdd.propTypes = propTypes
BoardAdd.defaultProps = defaultProps

export default connect(null, { addBoard })(BoardAdd)
