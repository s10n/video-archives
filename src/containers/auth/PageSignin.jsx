import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { signinUser } from '../../actions'
import Page from '../Page'
import FormSignin from '../../components/auth/FormSignin'

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
    return (
      <Page page="Signin" title="Sign in">
        <article className="Card">
          <div className="CardScroll">
            <FormSignin
              onSubmit={this.submit}
              isSubmitting={this.state.isSubmitting}
              errorMessage={this.props.errorMessage}
            />

            <Link to="/signup">Create account</Link>
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
  return bindActionCreators({ signinUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PageSignin)
