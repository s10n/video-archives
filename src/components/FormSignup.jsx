import React from 'react'
import { Field, reduxForm } from 'redux-form'
import RenderField from './Field'

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

const FormSignup = ({ handleSubmit, isSubmitting, errorMessage }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type="text" label="Email" component={RenderField} />
      <Field name="password" type="password" label="Password" component={RenderField} />
      <Field
        name="passwordConfirm"
        type="password"
        label="Password Confirm"
        component={RenderField}
      />

      <div>
        <button action="submit" disabled={isSubmitting}>
          Sign up
        </button>

        {errorMessage &&
          <span>
            {errorMessage}
          </span>}
      </div>
    </form>
  )
}

const formConfig = { form: 'signup', validate }

export default reduxForm(formConfig)(FormSignup)
