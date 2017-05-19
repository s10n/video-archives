import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import './AppSidebar.css'
import BoardAdd from '../components/BoardAdd'

const propTypes = {
  boards: PropTypes.object.isRequired,
  trash: PropTypes.bool.isRequired
}

const defaultProps = {
  boards: {},
  trash: false
}

class AppSidebar extends React.Component {
  render() {
    const { boards } = this.props

    return (
      <nav className="AppSidebar">
        {Object.keys(boards).map(key =>
          <Link activeClassName="active" to={boards[key].slug} key={key}>{boards[key].title}</Link>
        )}

        {this.props.trash &&
          <Link activeClassName="active" to="trash">Trash</Link>
        }

        <BoardAdd />
      </nav>
    )
  }
}

AppSidebar.propTypes = propTypes
AppSidebar.defaultProps = defaultProps

export default AppSidebar
