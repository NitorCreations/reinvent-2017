import React, { Component } from 'react';
import { Snackbar } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AwsLogin from './aws-login/aws-login'
import AppNav from './app-nav/app-nav'
import Admin from './admin/admin'

import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
import { Switch } from 'react-router'

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
    }
  }

  render() {

    const muiTheme = getMuiTheme({
      palette: {
        primary1Color: '#00a7e0',
        primary2Color: '#919191',
        primary3Color: '#618291',
        accent1Color: '#ac3e52',
        accent2Color: '#00988c',
        accent3Color: '#494a95',
        textColor: '#222222',
        alternateTextColor: '#ffffff',
        secondaryTextColor: '#ffffff',
        canvasColor: '#dbe0e7',
        borderColor: '#00a7e0',
        disabledColor: '#919191',
        pickerHeaderColor: '#00a7e0',
        clockCircleColor: '#dbe0e7',
        shadowColor: '#dbe0e7',
      },
      textField: {
        errorColor: '#ac3e52'
      }
    });

    console.log('muiTheme', muiTheme)

    // https://reacttraining.com/react-router/web/example/basic
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <BrowserRouter>
            <div>
              <AppNav />
              <Switch>
                <Route exact path="/" component={Admin}/>
                {/* without the exact this matches /tacos/* */}
                <Route path="/login" component={AwsLogin}/>
                { /* No match 404 */}
                <Route component={NoMatch}/>
              </Switch>
            </div>
          </BrowserRouter>
          <Snackbar
            open={this.state.loggedIn}
            message={'Logged in!'}
            autoHideDuration={2000} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
