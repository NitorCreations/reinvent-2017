import React  from 'react'
import { ResetPasswordForm } from '@nitor/aws-react-components'

import { RaisedButton, TextField } from 'material-ui'

class PasswordResetForm extends ResetPasswordForm {

  constructor(props) {
    super(props)
    this.state = {
      password: '',
      passwordConfirm: '',
    }
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value})
  }

  handlePasswordConfirmChange(event) {
    this.setState({passwordConfirm: event.target.value})
  }

  changePassword() {
    if(this.state.password && this.state.password !== this.state.passwordConfirm) {
      this.setState({error: 'Passwords do not match'})
      return
    }
    this.props.returnNewPassword(this.state.password);
  }

  render() {
    return (
      <div className="Login">
        <form>
          <div>
            <TextField floatingLabelText="New password"
                       onChange={event => this.handlePasswordChange(event)}
                       type="password"
                       value={this.state.password} id="password"
                       errorText={this.props.error}
                       errorStyle={{textAlign: 'left'}}/>
          </div>
          <div>
            <TextField floatingLabelText="New password again"
                       onChange={event => this.handlePasswordConfirmChange(event)}
                       type="password"
                       value={this.state.passwordConfirm} id="password" />
          </div>
          <RaisedButton label="Change password" onClick={() => this.changePassword()} />
        </form>
      </div>
    )
  }

}

export default PasswordResetForm