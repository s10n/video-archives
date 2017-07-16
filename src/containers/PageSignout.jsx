import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import { signoutUser } from '../actions/auth'
import Page from '../components/Page'
import Card from '../components/Card'

class Signout extends Component {
  componentWillMount() {
    this.props.authenticated && this.props.signoutUser()
  }

  render() {
    const { authenticated } = this.props

    return authenticated ? (
      <Page page="Signout" title="Goodbye">
        <Card>It was great to meet you.</Card>
      </Page>
    ) : <Redirect to="/" />
  }
}

function mapStateToProps({ auth }) {
  return { authenticated: auth.authenticated }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ signoutUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Signout)
