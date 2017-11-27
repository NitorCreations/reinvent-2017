import React, { Component } from 'react'
import './aws-login.css'
import { RaisedButton, TextField } from 'material-ui'
import { AWSCognitoWrapper } from '@nitor/aws-react-components'
import AppLoginForm from './app-login-form'
import PasswordResetForm from './password-reset-form'
import Admin from '../admin/admin'

/**
 * AwsLogin page.
 */
class AwsLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: 'simple',
      password: 'Simple!1234',
      visible: true,
      loggedIn: false,
      error: undefined,
    }
  }

  loginForm() {
    return (
      <div className="Login">
        <form>
          <div>
            <TextField floatingLabelText="username"
                       type="text" onChange={event => this.handleUsernameChange(event)} value={this.state.username} id="username"
                       errorText={this.state.error}
                       errorStyle={{textAlign: 'left'}}/>
          </div>
          <div>
            <TextField floatingLabelText="password"
                       onChange={event => this.handlePasswordChange(event)} type="password" value={this.state.password} id="password" />
          </div>
          <RaisedButton label="LOG IN" onClick={(event) => this.handleLogin(event)} />
        </form>
      </div>)
  }

  render() {
    return (
      <AWSCognitoWrapper awsRegion={window.config.aws.region}
                         awsUserPoolId={window.config.aws.userPoolId}
                         awsIdentityPoolId={window.config.aws.identityPoolId}
                         awsClientId={window.config.aws.clientId}
                         overrideLoginForm={AppLoginForm}
                         overrideResetPassword={PasswordResetForm}>
        <Admin></Admin>
      </AWSCognitoWrapper>
    )
  }
}


AwsLogin.defaultProps = {
  onLogin: () => {}
}

export default AwsLogin