import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { signoutUser } from '../../actions'
import Page from '../Page'

class Signout extends React.Component {
  componentWillMount() {
    this.props.signoutUser()
  }

  render() {
    return (
      <Page page="Signout" title="Goodbye">
        <article className="Card">
          <div className="CardScroll">
             It was great to meet you.
          </div>
        </article>
      </Page>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ signoutUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Signout)
