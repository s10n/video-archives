import React from 'react'
import { Link } from 'react-router'
import './AppSidebar.css'
import BoardAdd from '../components/BoardAdd'

const propTypes = {
  boardsList: React.PropTypes.array.isRequired,
  trash: React.PropTypes.bool.isRequired
}

const defaultProps = {
  boardsList: [],
  trash: false
}

class AppSidebar extends React.Component {
  render() {
    return (
      <nav className="AppSidebar">
        {this.props.boardsList.map(board =>
          <Link activeClassName="active" to={board.slug} key={board.slug}>{board.title}</Link>
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
