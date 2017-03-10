import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { fetchStorage, importStorage, emptyStorage } from '../actions/index'
import './PageFront.css'

class PageFront extends React.Component {
  constructor (props) {
    super(props)
    this.handleImportClick = this.handleImportClick.bind(this)
    this.handleEmptyClick = this.handleEmptyClick.bind(this)
  }

  handleImportClick () {
    confirm(`Import storage?`) && this.props.importStorage()
  }

  handleEmptyClick () {
    confirm(`Empty storage?`) && this.props.emptyStorage()
  }

  render() {
    return (
      <article className="Page">
        <header className="PageHeader">
          <h1 className="PageTitle">Welcome</h1>
        </header>

        <main className="PageContent">
          <div className="PageContentInner">
            <article className="Card">
              <div className="CardScroll">
                <div className="Paragraph">
                  <p>
                    Video Archives is an application for managing videos you like.
                  </p>

                  <ol>
                    <li>Create new board to start</li>
                    <li>
                      Or just import sample data to look around<br />
                      <button onClick={this.handleImportClick}>Import sample</button>
                      <button onClick={this.handleEmptyClick}>Empty storage</button>
                    </li>
                  </ol>
                </div>
              </div>
            </article>
          </div>
        </main>
      </article>
    )
  }
}

function mapStateToProps(state) {
  return { videoStorage: state.videoStorage }
}

export default connect(mapStateToProps, { fetchStorage, importStorage, emptyStorage })(PageFront)
