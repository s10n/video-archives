import React from 'react'
import { Link } from 'react-router'
import './AppSidebar.css'
import BoardAdd from '../components/BoardAdd'

const propTypes = {
  boardsList: React.PropTypes.object.isRequired,
  trash: React.PropTypes.bool.isRequired
}

const defaultProps = {
  boardsList: {},
  trash: false
}

class AppSidebar extends React.Component {
  render() {
    const { boardsList } = this.props
    return (
      <nav className="AppSidebar">
        {Object.keys(boardsList).map(key =>
          <Link activeClassName="active" to={key} key={key}>{boardsList[key].title}</Link>
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
