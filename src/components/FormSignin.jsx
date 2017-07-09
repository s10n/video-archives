import React from 'react'
import { Field, reduxForm } from 'redux-form'
import RenderField from './Field'

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

const FormSignin = ({ handleSubmit, isSubmitting, errorMessage }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type="text" label="Email" component={RenderField} />
      <Field name="password" type="password" label="Password" component={RenderField} />

      <div>
        <button action="submit" disabled={isSubmitting}>Sign in</button>
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    </form>
  )
}

const formConfig = { form: 'signin', validate }

export default reduxForm(formConfig)(FormSignin)
