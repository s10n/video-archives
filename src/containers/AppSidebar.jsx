import React from 'react'
import { Link } from 'react-router'
import './AppSidebar.css'
import BoardAdd from '../components/BoardAdd'

const propTypes = {
  boardsList: React.PropTypes.array.isRequired
}

const defaultProps = {
  boardsList: []
}

class AppSidebar extends React.Component {
  render() {
    return (
      <nav className="AppSidebar">
        {this.props.boardsList.map(item => {return (
          <Link to={`${item.name}`} key={item.name}>{item.name}</Link>
        )})}

        <BoardAdd />
      </nav>
    )
  }
}

AppSidebar.propTypes = propTypes
AppSidebar.defaultProps = defaultProps

export default AppSidebar
