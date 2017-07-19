import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { storageTest } from '../config/constants'
import { importStorage, emptyStorage } from '../actions/storage'
import './PageFront.css'
import Page from '../components/Page'
import Card from '../components/Card'

const propTypes = {
  importStorage: PropTypes.func.isRequired,
  emptyStorage: PropTypes.func.isRequired
}

class PageFront extends Component {
  constructor(props) {
    super(props)

    this.handleImportClick = this.handleImportClick.bind(this)
    this.handleEmptyClick = this.handleEmptyClick.bind(this)
  }

  handleImportClick() {
    window.confirm(`Import sample?`) && this.props.importStorage()
  }

  handleEmptyClick() {
    window.confirm(`Empty storage?`) && this.props.emptyStorage()
  }

  render() {
    return (
      <Page page="Front" title="Welcome">
        <Card>
          <section className="Paragraph">
            <h2>
              Video Archives is an application for managing{' '}
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                YouTube
              </a>{' '}
              videos you like
            </h2>
            <ol>
              <li>Create a new board to start</li>
              <li>
                Or just import sample data to look around<br />
                <button onClick={this.handleImportClick}>Import sample</button>
                <button onClick={this.handleEmptyClick}>Empty storage</button>
              </li>
            </ol>
          </section>

          <section className="Paragraph">
            <h2>Requirements</h2>
            <ul>
              <li>
                This app uses{' '}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  localStorage
                </a>{' '}
                to store videos. (
                {storageTest()
                  ? `And your browser supports localStorage.`
                  : `But your browser doesn't support localStorage.`})<br />
                So you don't need to sign up. But if you change your browser or empty your browser
                storage, you will not be able to access videos you stored.
              </li>
            </ul>
          </section>

          <section className="Paragraph">
            <h2>Description</h2>
            <ul>
              <li>
                This app was bootstrapped with{' '}
                <a
                  href="https://github.com/facebookincubator/create-react-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create React App
                </a>.
              </li>
              <li>
                This app is being built with{' '}
                <a
                  href="https://facebook.github.io/react/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React
                </a>,{' '}
                <a href="http://redux.js.org/" target="_blank" rel="noopener noreferrer">
                  Redux
                </a>{' '}
                and{' '}
                <a
                  href="https://reacttraining.com/react-router/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Router
                </a>.
              </li>
              <li>
                Codes are at{' '}
                <a
                  href="https://github.com/s10n/video-archives"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repository
                </a>.
              </li>
            </ul>
          </section>

          <section className="Paragraph">
            <h2>Creator</h2>
            <ul>
              <li>
                Designed and developed by{' '}
                <a href="https://github.com/s10n" target="_blank" rel="noopener noreferrer">
                  Sim Cheolhwan
                </a>{' '}
                in Earth.
              </li>
            </ul>
          </section>
        </Card>
      </Page>
    )
  }
}

PageFront.propTypes = propTypes

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ importStorage, emptyStorage }, dispatch)
}

export default connect(null, mapDispatchToProps)(PageFront)
