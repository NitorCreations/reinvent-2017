import React, { Component } from 'react'
import './admin.css'
import { RaisedButton, TextField } from 'material-ui'
import * as _ from 'lodash'
import MapDisplay from '../map-display/map-display'
import List, { ListItem } from 'material-ui/List';

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isApprovedExpanded: false,
      isDiscardedExpanded: false,
      isNewExpanded: true,
      selected: null
    }

    this.approve = this.approve.bind(this)
    this.discard = this.discard.bind(this)
  }

  select(item) {
    this.setState({
      selected: item
    })
  }

  approve(item = this.state.selected) {
    console.log('approve', item)
  }

  discard(item = this.state.selected) {
    console.log('discard', item)
  }

  render() {
    const alert = {
      "type": "security",
      "lon": -115.1697,
      "lat": 36.1212,
      "description": "this is sparta",
      "time": "2017-11-26T10:34:56.123Z"
    }

    const discarded = _.map([alert, alert], (x, i) => (<ListItem key={i}
      onClick={this.select.bind(this, x)}>
      {x.description}
    </ListItem>))
    const approved = _.map([alert, alert], (x, i) => (<ListItem key={i}
      onClick={this.select.bind(this, x)}>
      {x.description}
    </ListItem>))
    const newalerts = _.map([alert, alert], (x, i) => (<ListItem key={i}
      onClick={this.select.bind(this, x)}>
      {x.description}
    </ListItem>))

    const positions = [{
      lat: _.get(this.state.selected, 'lat'),
      lng: _.get(this.state.selected, 'lon')
    }]

    return (
      <div className="left col-12 Admin">
        <div className="left col-4 bg-gray">
          <div className="bg-black left col-12 p2">
            <img src="https://www.internetalerts.org/img/fia-logo-color.b829b6b9.svg" alt="FIA"/>
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable" onClick={() => this.setState({ isNewExpanded: !this.state.isNewExpanded})}>
              New alerts
              <span className="text-small text-dark"> ({newalerts.length})</span>
            </h2>
            { this.state.isNewExpanded && (<List dense="true">
              {newalerts}
            </List>) }
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable" onClick={() => this.setState({ isApprovedExpanded: !this.state.isApprovedExpanded})}>
              Approved alerts
              <span className="text-small text-dark"> ({approved.length})</span>
            </h2>
            { this.state.isApprovedExpanded && (<List dense="true">
              {approved}
            </List>) }
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable" onClick={() => this.setState({ isDiscardedExpanded: !this.state.isDiscardedExpanded})}>
              Discarded alerts
              <span className="text-small text-dark"> ({discarded.length})</span>
            </h2>
            { this.state.isDiscardedExpanded && (<List dense="true">
              {discarded}
            </List>) }
          </div>

        </div>


        { this.state.selected && (
          <div className="left col-8 p2">

            <div className="left col-12 mb2">
              <div>Description: {this.state.selected.description}</div>
              <div>Type: {this.state.selected.type}</div>
              <div>Time: {this.state.selected.time}</div>
            </div>

            <div className="left col-12 mb2">
              <RaisedButton label="Approve" primary={true} onClick={this.approve} />
              <RaisedButton label="Discard" onClick={this.discard} />
            </div>

            <div className="left col-12">
              <MapDisplay
                positions={positions}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKUDBJCrNjL5cpZmqugqjQL8ydWNidX7M&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />} />
            </div>

          </div>)
        }


      </div>
    )
  }
}


Admin.defaultProps = {
  onLogin: () => {}
}

export default Admin