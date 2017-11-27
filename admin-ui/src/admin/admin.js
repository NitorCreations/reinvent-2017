import React, { Component } from 'react'
import './admin.css'
import { RaisedButton, TextField } from 'material-ui'
import config from '../config.js'
import * as _ from 'lodash'
import MapDisplay from '../map-display/map-display'
import List, { ListItem } from 'material-ui/List';

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isApprovedExpanded: false,
      isDiscardedExpanded: false,
      isNewExpanded: true
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

    const discarded = _.map([alert, alert], (x, i) => (<ListItem key={i}>{x.description}</ListItem>))
    const approved = _.map([alert, alert], (x, i) => (<ListItem key={i}>{x.description}</ListItem>))
    const newalerts = _.map([alert, alert], (x, i) => (<ListItem key={i}>{x.description}</ListItem>))

    const positions = [
      { lat: 36.1212, lng: -115.1697 },
      { lat: 36.1012, lng: -115.1097 }]

    return (
      <div className="left col-12 Admin">
        <div className="left col-4 bg-gray">
          <div className="bg-black left col-12 p2">
            <img src="https://www.internetalerts.org/img/fia-logo-color.b829b6b9.svg" alt="FIA"/>
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable" onClick={() => this.setState({ isNewExpanded: !this.state.isNewExpanded})}>
              New alerts
              <span class="text-small text-dark"> ({newalerts.length})</span>
            </h2>
            { this.state.isNewExpanded && (<List dense="true">
              {newalerts}
            </List>) }
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable" onClick={() => this.setState({ isApprovedExpanded: !this.state.isApprovedExpanded})}>
              Approved alerts
              <span class="text-small text-dark"> ({approved.length})</span>
            </h2>
            { this.state.isApprovedExpanded && (<List dense="true">
              {approved}
            </List>) }
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable" onClick={() => this.setState({ isDiscardedExpanded: !this.state.isDiscardedExpanded})}>
              Discarded alerts
              <span class="text-small text-dark"> ({discarded.length})</span>
            </h2>
            { this.state.isDiscardedExpanded && (<List dense="true">
              {discarded}
            </List>) }
          </div>

        </div>


        <div className="left col-8 p2">

          <MapDisplay
            positions={positions}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKUDBJCrNjL5cpZmqugqjQL8ydWNidX7M&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />} />

        </div>


      </div>
    )
  }
}


Admin.defaultProps = {
  onLogin: () => {}
}

export default Admin