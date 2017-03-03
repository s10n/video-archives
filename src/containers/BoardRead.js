import React from 'react'

class BoardRead extends React.Component {
  render() {
    return (
      <section>
        <h1>{this.props.params.boardName}</h1>
      </section>
    )
  }
}

export default BoardRead
