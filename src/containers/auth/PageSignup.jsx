import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { signupUser } from '../../actions'
import Page from '../Page'
import FormSignup from '../../components/auth/FormSignup'

class PageSignup extends React.Component {
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
    return (
      <Page page="Signup" title="Create your account">
        <article className="Card">
          <div className="CardScroll">
            <FormSignup
              onSubmit={this.submit}
              isSubmitting={this.state.isSubmitting}
              errorMessage={this.props.errorMessage}
            />
          </div>
        </article>
      </Page>
    )
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ signupUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PageSignup)
