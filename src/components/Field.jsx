import React from 'react'

const Field = ({ label, type, input, meta }) => (
  <div className="form-element">
    <label>{label}</label>
    <div>
      <input type={type} {...input} />
      {meta.touched && meta.error && <small>{meta.error}</small>}
    </div>
  </div>
)

export default Field
