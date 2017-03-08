import React from 'react'
import './PageTrash'

const propTypes = {
}

const defaultProps = {
}

class PageTrash extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <section>
        <h1 className="page-title">Trash</h1>
        <main className="page-content" />
      </section>
    )
  }
}

PageTrash.propTypes = propTypes
PageTrash.defaultProps = defaultProps

export default PageTrash
