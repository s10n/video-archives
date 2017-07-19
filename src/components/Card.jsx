import React from 'react'
import PropTypes from 'prop-types'
import './Card.css'

const propTypes = {
  header: PropTypes.element,
  footer: PropTypes.element,
  variant: PropTypes.object,
  canDrop: PropTypes.bool,
  children: PropTypes.node
}

const Card = ({ header, footer, variant, canDrop, children }) => {
  return (
    <article className={canDrop ? 'Card canDrop' : 'Card'}>
      <header className="CardHeader" style={variant}>
        {header}
      </header>

      <main className="CardScroll">
        {children}
      </main>

      {footer &&
        <footer className="CardFooter">
          {footer}
        </footer>}
    </article>
  )
}

Card.propTypes = propTypes

export default Card
