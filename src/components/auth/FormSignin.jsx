import React from 'react'
import { Field, reduxForm } from 'redux-form'

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

const renderField = field => (
  <div className="form-element">
    <label>{field.label}</label>
    <div>
      <input type={field.type} {...field.input} />
      {field.meta.touched && field.meta.error && <small>{field.meta.error}</small>}
    </div>
  </div>
)

const FormSignin = props => {
  const { handleSubmit, isSubmitting, errorMessage } = props

  return (
    <form onSubmit={handleSubmit}>
      <Field name="email" type="text" label="Email" component={renderField} />
      <Field name="password" type="password" label="Password" component={renderField} />

      <div>
        <button action="submit" disabled={isSubmitting}>Sign in</button>
        {errorMessage && <span>{errorMessage}</span>}
      </div>
    </form>
  )
}

const formConfig = { form: 'signin', validate }

export default reduxForm(formConfig)(FormSignin)
