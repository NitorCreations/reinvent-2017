import React  from 'react'
import { LoginForm } from '@nitor/aws-react-components'
import { RaisedButton, TextField } from 'material-ui'

class AppLoginForm extends LoginForm {

  constructor(props) {
    super(props)
    this.state = {
      username: 'test',
      password: 'test123!TEST',
    }
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value})
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value})
  }
  handleLogin(event) {
    event.preventDefault();
    this.props.loginHandler(this.state.username, this.state.password);
  }

  render() {
    return (
      <div className="Login">
        <form>
          <div>
            <TextField floatingLabelText="username"
                       type="text" onChange={event => this.handleUsernameChange(event)} value={this.state.username} id="username"
                       errorText={this.props.error}
                       errorStyle={{textAlign: 'left'}}/>
          </div>
          <div>
            <TextField floatingLabelText="password"
                       onChange={event => this.handlePasswordChange(event)} type="password" value={this.state.password} id="password" />
          </div>
          <RaisedButton label="LOG IN" onClick={(event) => this.handleLogin(event)} />
        </form>
      </div>
    )
  }
}

export default AppLoginForm