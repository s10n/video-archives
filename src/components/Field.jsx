import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  input: PropTypes.object,
  meta: PropTypes.object
}

const defaultProps = {
  label: '',
  input: {},
  meta: {}
}

const Field = ({ label, type, input, meta }) =>
  <div className="form-element">
    {label &&
      <label>
        {label}
      </label>}

    <div>
      <input type={type} {...input} />

      {meta.touched &&
        meta.error &&
        <small>
          {meta.error}
        </small>}
    </div>
  </div>

Field.propTypes = propTypes
Field.defaultProps = defaultProps

export default Field
