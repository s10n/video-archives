import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, Link } from 'react-router-dom'
import { signinUser } from '../actions/auth'
import Page from '../components/Page'
import Card from '../components/Card'
import FormSignin from '../components/FormSignin'

class PageSignin extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isSubmitting: false }

    this.submit = this.submit.bind(this)
  }

  submit(values) {
    this.setState({ isSubmitting: true })
    this.props.signinUser(values)
    this.setState({ isSubmitting: false })
  }

  render() {
    const { authenticated, errorMessage } = this.props
    const { isSubmitting } = this.state

    return !authenticated ? (
      <Page page="Signin" title="Sign in">
        <Card>
          <FormSignin
            onSubmit={this.submit}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
          />

          <Link to="/signup">Create account</Link>
        </Card>
      </Page>
    ) : <Redirect to="/" />
  }
}

function mapStateToProps({ auth }) {
  return { authenticated: auth.authenticated, errorMessage: auth.error }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ signinUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PageSignin)
