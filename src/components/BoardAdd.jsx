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
    this.state = { name: '', slug: '' }
    this.onInputChange = this.onInputChange.bind(this)
    this.onPressEnter = this.onPressEnter.bind(this)
  }

  onInputChange(event) {
    const name = event.target.value
    this.setState({ ...this.state, name: name})
  }

  onPressEnter() {
    const name = this.state.name.trim()
    const slug = name.toString().toLowerCase().replace(/\s+/g, '-')

    if (name && slug) {
      const newBoard = { name, slug }
      this.props.addBoard(newBoard)
      this.context.router.push(slug)
    } else {
      console.log('Board name is required')
    }

    this.setState({ name: '', slug: '' })
  }

  render() {
    return (
      <section className="BoardAdd">
        <input
          type="text"
          onChange={this.onInputChange}
          onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
          value={this.state.name}
          placeholder="Create new board..."
        />

        {this.state.name.length > 0 &&
          <p className="HelpBlock">
            <small>Press enter key to create &crarr;</small>
          </p>
        }
      </section>
    )
  }
}

BoardAdd.propTypes = propTypes
BoardAdd.defaultProps = defaultProps

export default connect(null, { addBoard })(BoardAdd)
