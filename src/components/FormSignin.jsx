import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import RenderField from './Field'

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  errorMessage: PropTypes.string
}

const defaultProps = {
  isSubmitting: false,
  errorMessage: ''
}

const validate = values => {
  const errors = {}

  if (!values.email) {
    errors.email = 'Required'
  }

  if (!values.password) {
    errors.password = 'Required'
  }

  return errors
}

const FormSignin = ({ handleSubmit, isSubmitting, errorMessage }) =>
  <form onSubmit={handleSubmit}>
    <Field name="email" type="text" label="Email" component={RenderField} />
    <Field name="password" type="password" label="Password" component={RenderField} />

    <div>
      <button action="submit" disabled={isSubmitting}>
        Sign in
      </button>

      {errorMessage &&
        <span>
          {errorMessage}
        </span>}
    </div>
  </form>

FormSignin.propTypes = propTypes
FormSignin.defaultProps = defaultProps

const formConfig = { form: 'signin', validate }

export default reduxForm(formConfig)(FormSignin)
