import React, { Component } from 'react'
import './admin.css'
import { RaisedButton, TextField } from 'material-ui'
import config from '../config.js'
import * as _ from 'lodash'

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {

    const alert = {
      "type": "security",
      "location": {
          "lon": 25.6,
          "lat": 60.0
      },
      "description": "this is sparta",
      "time": "2017-11-26T10:34:56.123Z"
    }

    const discarded = _.map([alert, alert], (x) => (<div>{x.description}</div>))
    const approved = _.map([alert, alert], (x) => (<div>{x.description}</div>))
    const newalerts = _.map([alert, alert], (x) => (<div>{x.description}</div>))

    return (
      <div className="left col-12 Admin">
        <div className="left col-4 bg-gray">
          <div className="bg-black left col-12 p2">
            <img src="https://www.internetalerts.org/img/fia-logo-color.b829b6b9.svg" alt="FIA"/>
          </div>

          <div className="left col-12 p2">
            <h2>New alerts</h2>
            {newalerts}
          </div>

          <div className="left col-12 p2">
            <h2>Approved alerts</h2>
            {approved}
          </div>

          <div className="left col-12 p2">
            <h2>Discarded alerts</h2>
            {discarded}

          </div>

        </div>


        <div className="left col-8 p2">meh</div>


      </div>
    )
  }
}


Admin.defaultProps = {
  onLogin: () => {}
}

export default Admin