import React from 'react'
import PropTypes from 'prop-types'
import './Card.css'

const propTypes = {
  header: PropTypes.element,
  footer: PropTypes.element,
  children: PropTypes.node
}

const Card = ({ header, footer, children }) => {
  return (
    <article className="Card">
      <header className="CardHeader">
        {header}
      </header>

      <main className="CardScroll">
        {children}
      </main>

      {footer && (
        <footer className="CardFooter">
          {footer}
        </footer>
      )}
    </article>
  )
}

Card.propTypes = propTypes

export default Card
