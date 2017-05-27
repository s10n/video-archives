import React from 'react'
import { Field, reduxForm } from 'redux-form'

const validate = values => {
  const errors = {}

  // TODO: Async validation
  if (!values.email) {
    errors.email = 'Required'
  }

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 6) {
    errors.password = 'Must be 6 characters or more'
  }

  if (!values.passwordConfirm) {
    errors.passwordConfirm = 'Required'
  }

  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = 'Not match'
  }

  return errors
}

const renderField = field => (
  <div className="form-element">
    <label>{field.label}</label>
    <div>
      <input type={field.type} {...field.input} />
      {field.meta.touched && field.meta.error && <small>{field.meta.error}</small>}
    </div>
  </div>
)

const FormSignup = props => {
  const { handleSubmit, isSubmitting, errorMessage } = props

  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type="text" label="Email" component={renderField} />
      <Field name="password" type="password" label="Password" component={renderField} />
      <Field name="passwordConfirm" type="password" label="Password Confirm" component={renderField} />

      <div>
        <button action="submit" disabled={isSubmitting}>Sign up</button>
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    </form>
  )
}

const formConfig = { form: 'signup', validate }

export default reduxForm(formConfig)(FormSignup)
