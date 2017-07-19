import React from 'react'
import PropTypes from 'prop-types'
import './Page.css'

const propTypes = {
  page: PropTypes.string.isRequired,
  header: PropTypes.element,
  title: PropTypes.string,
  children: PropTypes.node
}

const defaultProps = {
  header: null,
  title: '',
  children: null
}

const Page = ({ page, header, title, children }) =>
  <article className={`Page Page${page}`}>
    <header className="PageHeader">
      {title
        ? <h1 className="PageTitle">
            {title}
          </h1>
        : header}
    </header>

    <main className="PageContent">
      <div className="PageContentInner">
        {children}
      </div>
    </main>
  </article>

Page.propTypes = propTypes
Page.defaultProps = defaultProps

export default Page
