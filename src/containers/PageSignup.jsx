import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import { signupUser } from '../actions/auth'
import { appConfig } from '../config/config'
import Page from '../components/Page'
import Card from '../components/Card'
import FormSignup from '../components/FormSignup'

class PageSignup extends Component {
  constructor(props) {
    super(props)

    this.state = { isSubmitting: false }

    this.submit = this.submit.bind(this)
  }

  submit(values) {
    this.setState({ isSubmitting: true })
    this.props.signupUser(values)
    this.setState({ isSubmitting: false })
  }

  render() {
    const { authenticated, errorMessage } = this.props
    const { isSubmitting } = this.state

    return !authenticated && appConfig.signupAllowed ? (
      <Page page="Signup" title="Create your account">
        <Card>
          <FormSignup
            onSubmit={this.submit}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
          />
        </Card>
      </Page>
    ) : <Redirect to="/" />
  }
}

function mapStateToProps({ auth }) {
  return { authenticated: auth.authenticated, errorMessage: auth.error }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ signupUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PageSignup)
