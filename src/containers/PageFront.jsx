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
    const storageTest = () => {
      // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
      var mod = 'modernizr';
      try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
      } catch (e) {
        return false;
      }
    }

    return (
      <article className="Page PageFront">
        <header className="PageHeader">
          <h1 className="PageTitle">Welcome</h1>
        </header>

        <main className="PageContent">
          <div className="PageContentInner">
            <article className="Card">
              <div className="CardScroll">
                <section className="Paragraph">
                  <h2>Video Archives is an application for managing videos you like</h2>
                  <ol>
                    <li>Create new board to start</li>
                    <li>Or just import sample data to look around<br />
                      <button onClick={this.handleImportClick}>Import sample</button>
                      <button onClick={this.handleEmptyClick}>Empty storage</button>
                    </li>
                  </ol>
                </section>

                <section className="Paragraph">
                  <h2>Requirements</h2>
                  <ul>
                    <li>
                      This app uses <a
                      href="https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage"
                      target="_blank">localStorage</a> to store videos. (
                      {storageTest() ? `And your browser supports localStorage.` :
                        `But your browser doesn't support localStorage.`})<br />
                      So you don't need to sign up.
                      But if you change browser or empty browser storage, you will be not able to
                      access videos you stored.
                    </li>
                  </ul>
                </section>

                <section className="Paragraph">
                  <h2>Description</h2>
                  <ul>
                    <li>This app was bootstrapped with <a
                      href="https://github.com/facebookincubator/create-react-app" target="_blank">
                      Create React App</a>.
                    </li>
                    <li>This app is built with <a
                      href="https://facebook.github.io/react/" target="_blank">React</a>, <a
                      href="http://redux.js.org/" target="_blank">Redux</a> and <a
                      href="https://reacttraining.com/react-router/" target="_blank">React Router</a>.
                    </li>
                    <li>
                      Codes are on <a href="https://github.com/s10n/video-archives"
                      target="_blank">GitHub repository</a>.
                    </li>
                  </ul>
                </section>

                <section className="Paragraph">
                  <h2>Creator</h2>
                  <ul>
                    <li>
                      Designed and developed by <a href="https://github.com/s10n" target="_blank">
                      Sim Cheolhwan</a> in Earth.
                    </li>
                  </ul>
                </section>
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
