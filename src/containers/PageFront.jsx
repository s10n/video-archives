import React from 'react'
import './PageFront.css'

class PageFront extends React.Component {
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
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </article>
          </div>
        </main>
      </article>
    )
  }
}

export default PageFront
