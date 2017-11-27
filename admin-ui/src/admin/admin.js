import React, { Component } from 'react'
import './admin.css'
import { RadioButton, RadioButtonGroup, RaisedButton, TextField } from 'material-ui'
import * as _ from 'lodash'
import MapDisplay from '../map-display/map-display'
import List, { ListItem } from 'material-ui/List';
import { listPendingAlerts } from './api'

const alert = {
  "type": "security",
  "lon": -115.1697,
  "lat": 36.1212,
  "description": "this is sparta",
  "time": "2017-11-26T10:34:56.123Z"
}

const alert2 = {
  "type": "security",
  "lon": -115.1597,
  "lat": 36.1292,
  "description": "this is las vegas",
  "time": "2017-11-26T10:34:56.123Z"
}

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

  approve(event, item = this.state.selected) {
    const {
      time,
      category,
      urgency,
      severity,
      certainty,
      description,
      instruction,
      lat,
      lon
    } = item

    const data = {
      "alert": {
        "identifier" : "abcabbacd",
        "sender": "nitor-rptf-team",
        "senderName": "Nitor RPTF",
        "sent": (new Date()).toISOString(),
        "status": "Actual",
        "event": "disaster event",
        category,
        urgency,
        severity,
        certainty,
        instruction,
        time,
        "msgType": "Alert",
        "scope": "Public",
        "headline" : "There's ongoing hackathon event",
        "locationType" : "circle",
        "locationParams" : {
          radius : "1"
        },
        "location": [{ lon, lat }],
        "description": [{
          language: "en-us",
          text : description
        }]
      }
    }

    console.log(data)
  }

  discard(item = this.state.selected) {
    console.log('discard', item)
  }

  logout() {
    localStorage.clear()
    window.location = '/'
  }

  updateField(field, event, value) {
    this.select(Object.assign({}, this.state.selected, { [field]: value }))
  }

  render() {
    // TODO 
    listPendingAlerts(this.props.AWS)
      .then(data => {
        console.info('listPendingAlerts', data)
      }, err => {
        console.error('listPendingAlerts', err)
      })

    const discarded = _.map([alert, alert2], (x, i) => (<ListItem key={i}
      onClick={this.select.bind(this, x)}>
      {x.description}
    </ListItem>))
    const approved = _.map([alert, alert2], (x, i) => (<ListItem key={i}
      onClick={this.select.bind(this, x)}>
      {x.description}
    </ListItem>))
    const newalerts = _.map([alert, alert2], (x, i) => (<ListItem key={i}
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
            <a onClick={this.logout} className="clickable text-white">Logout</a>
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable m0" onClick={() => this.setState({ isNewExpanded: !this.state.isNewExpanded})}>
              New alerts
              <span className="text-small text-dark"> ({newalerts.length})</span>
            </h2>
            { this.state.isNewExpanded && (<List dense="true">
              {newalerts}
            </List>) }
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable m0" onClick={() => this.setState({ isApprovedExpanded: !this.state.isApprovedExpanded})}>
              Approved alerts
              <span className="text-small text-dark"> ({approved.length})</span>
            </h2>
            { this.state.isApprovedExpanded && (<List dense="true">
              {approved}
            </List>) }
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable m0" onClick={() => this.setState({ isDiscardedExpanded: !this.state.isDiscardedExpanded})}>
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
            <div className="card p2">
              <div className="left col-12 mb2">
                <h3 className="m0 mb2">
                  Waiting for approval: {this.state.selected.description}
                  <span className="right text-red mt1 text-small uppercase" onClick={this.discard}>discard</span>
                </h3>
                <div>
                  <span className="bold">Time sent: </span>
                  {this.state.selected.time}
                </div>
                <div>
                  <span className="bold">From: </span>
                  someone@someplace.com
                </div>
              </div>

              <div className="left col-8 mb2">
                <div className="mb1">
                  <span className="bold">Location: </span>
                  TODO
                </div>
                <MapDisplay
                  positions={positions}
                  googleMapURL={'https://maps.googleapis.com/maps/api/js?key=' + window.config.googleMapsApiKey + '&v=3.exp&libraries=geometry,drawing,places'}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `200px` }} />}
                  mapElement={<div style={{ height: `100%` }} />} />
              </div>

              <div className="left col-8 mb2">
                <div className="mb1 bold">description</div>
                description goes here
              </div>

              <div className="left col-8 mb2">
                <div className="mb1 bold">Image</div>
                maybe, we'll see.
              </div>

              <div className="left col-8 mb2">
                <div className="mb1 bold">Category</div>
                <RadioButtonGroup name="category" onChange={this.updateField.bind(this, 'category')}>
                  { _.times(5, (i) => (<RadioButton value={i} label={`Category ${i + 1}` } key={i} />)) }
                </RadioButtonGroup>
              </div>

              <div className="left col-8 mb2">
                <div className="mb1 bold">Severity</div>
                <RadioButtonGroup name="severity" onChange={this.updateField.bind(this, 'severity')}>
                  { _.times(5, (i) => (<RadioButton value={i} label={`Severity ${i + 1}` } key={i} />)) }
                </RadioButtonGroup>
              </div>

              <div className="left col-8 mb2">
                <div className="mb1 bold">Urgency</div>
                <RadioButtonGroup name="urgency" onChange={this.updateField.bind(this, 'urgency')}>
                  { _.times(5, (i) => (<RadioButton value={i} label={`Urgency ${i + 1}` } key={i} />)) }
                </RadioButtonGroup>
              </div>

              <div className="left col-8 mb2">
                <div className="mb1 bold">Certainty</div>
                <RadioButtonGroup name="certainty" onChange={this.updateField.bind(this, 'certainty')}>
                  { _.times(5, (i) => (<RadioButton value={i} label={`Certainty ${i + 1}` } key={i} />)) }
                </RadioButtonGroup>
              </div>

              <div className="left col-8 mb2">
                <div className="mb1 bold">Instructions</div>
                Instructions go here
              </div>

              <div className="left col-12">
                <RaisedButton label="Approve" primary={true} onClick={this.approve} className="right" />
                <RaisedButton label="Discard" onClick={this.discard} className="right ml1" />
              </div>
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
