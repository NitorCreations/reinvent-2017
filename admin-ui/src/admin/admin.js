import React, { Component } from 'react'
import './admin.css'
import { RadioButton, RadioButtonGroup, RaisedButton, TextField } from 'material-ui'
import * as _ from 'lodash'
import MapDisplay from '../map-display/map-display'
import List, { ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import { listPendingAlerts, rejectAlert, approveAlert, geoReverse } from './api'
import { CATEGORIES, SEVERITIES, URGENCIES, CERTAINTIES } from './static-data'
import Snackbar from 'material-ui/Snackbar';

class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isApprovedExpanded: false,
      isDiscardedExpanded: false,
      isNewExpanded: true,
      selected: null,
      pending: [],
      approved: [],
      discarded: [],
      done: false
    }

    this.approve = this.approve.bind(this)
    this.discard = this.discard.bind(this)

    listPendingAlerts(props.AWS)
      .then(pending => {
        _.each(pending, item => geoReverse(item).then(geo => {
          item.geo = geo
          const pending = _.orderBy([ ...this.state.pending, item ], 'time')
          this.setState({ pending })
        }))
      })
  }

  select(item) {
    this.setState({ selected: item })
  }

  approve() {
    const item = this.state.selected
    const {
      time,
      category,
      urgency,
      severity,
      certainty,
      description,
      instruction,
      lat,
      lon,
      id
    } = item

    const data = {
      "alert": {
        "identifier" : id,
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

    approveAlert(this.props.AWS, item).then(() => this.setState({
      pending: _.without(this.state.pending, item),
      approved: [ item, ...this.state.discarded ],
      done: true,
      selected: null
    }))
  }

  discard() {
    const item = this.state.selected
    rejectAlert(this.props.AWS, item).then(() => this.setState({
      pending: _.without(this.state.pending, item),
      discarded: [ item, ...this.state.discarded ],
      done: true,
      selected: null
    }))
  }

  logout() {
    localStorage.clear()
    window.location = '/'
  }

  updateField(field, event, value) {
    this.select(Object.assign({}, this.state.selected, { [field]: value }))
  }

  render() {
    const makeListItem = (item, index) => {
      const types = {
        security: 'sec',
        fire: 'fire',
        infrastructure: 'infr'
      }

      const type = types[item.type.toLowerCase()] || item.type
      const loc = `${_.get(item, 'geo.address.state')}, ${_.get(item, 'geo.address.country_code', '').toUpperCase()}`

      return (<ListItem key={index}
        onClick={this.select.bind(this, item)}>
        <span className="tag text-small text-white bg-black mr1">{ type }</span>
        <span className="bold mr1">{loc}</span><br/>
        <span className="ml3 pl1 text-smaller">{item.time}</span>
      </ListItem>)
    }

    const discarded = _.map(this.state.discarded, makeListItem)
    const approved = _.map(this.state.approved, makeListItem)
    const pending = _.map(this.state.pending, makeListItem)

    const positions = [{
      lat: _.get(this.state.selected, 'lat'),
      lng: _.get(this.state.selected, 'lon')
    }]

    return (
      <div className="left col-12 Admin">
        <div className="col-4 bg-gray fixed left-0 top-0">
          <div className="bg-black left col-12 p2">
            <img src="https://www.internetalerts.org/img/fia-logo-color.b829b6b9.svg" alt="FIA"/>
            <a onClick={this.logout} className="clickable text-white">Logout</a>
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable m0" onClick={() => this.setState({ isNewExpanded: !this.state.isNewExpanded})}>
              <FontIcon className="material-icons">
                { this.state.isNewExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
              </FontIcon>
              New alerts
              <span className="text-small text-dark"> ({pending.length})</span>
            </h2>
            { this.state.isNewExpanded && (<List dense="true">
              {pending}
            </List>) }
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable m0" onClick={() => this.setState({ isApprovedExpanded: !this.state.isApprovedExpanded})}>
              <FontIcon className="material-icons">
                { this.state.isApprovedExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
              </FontIcon>
              Approved alerts
              <span className="text-small text-dark"> ({approved.length})</span>
            </h2>
            { this.state.isApprovedExpanded && (<List dense="true">
              {approved}
            </List>) }
          </div>

          <div className="left col-12 p2">
            <h2 className="text-red clickable m0" onClick={() => this.setState({ isDiscardedExpanded: !this.state.isDiscardedExpanded})}>
              <FontIcon className="material-icons">
                { this.state.isDiscardedExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
              </FontIcon>
              Discarded alerts
              <span className="text-small text-dark"> ({ discarded.length })</span>
            </h2>
            { this.state.isDiscardedExpanded && (<List dense="true">
              {discarded}
            </List>) }
          </div>

        </div>

        <Snackbar
          open={this.state.done}
          message="Done!"
          autoHideDuration={2000}
          onRequestClose={() => this.setState({done: false})}
        />


        { this.state.selected && (
          <div className="right col-8 p2">
            <div className="card p2">
              <div className="left col-12 mb2">
                <h3 className="m0 mb2">
                  Waiting for approval: {this.state.selected.description}
                  <span className="right text-red mt1 text-small uppercase clickable" onClick={this.discard}>discard</span>
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
                  { this.state.selected.geo.display_name }
                </div>
                <MapDisplay
                  positions={positions}
                  googleMapURL={'https://maps.googleapis.com/maps/api/js?key=' + window.config.googleMapsApiKey + '&v=3.exp&libraries=geometry,drawing,places'}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `200px` }} />}
                  mapElement={<div style={{ height: `100%` }} />} />
              </div>

              <div className="left col-8 mb2">
                <div className="mb1 bold">Description</div>
                { this.state.selected.description }
              </div>

              <div className="left col-8 mb2">
                <div className="mb1 bold">Image</div>
                <img src="https://dummyimage.com/400x240/666/999&text=image" alt=""/>
              </div>

              <div className="left col-12 mb2">
                <div className="mb1 bold">Category</div>
                <RadioButtonGroup name="category" onChange={this.updateField.bind(this, 'category')}>
                  { _.map(CATEGORIES, (item) => (<RadioButton value={item} label={item} key={item} />)) }
                </RadioButtonGroup>
              </div>

              <div className="left col-12 mb2">
                <div className="mb1 bold">Severity</div>
                <RadioButtonGroup name="severity" onChange={this.updateField.bind(this, 'severity')}>
                  { _.map(SEVERITIES, (item) => (<RadioButton value={item} label={item} key={item} />)) }
                </RadioButtonGroup>
              </div>

              <div className="left col-12 mb2">
                <div className="mb1 bold">Urgency</div>
                <RadioButtonGroup name="urgency" onChange={this.updateField.bind(this, 'urgency')}>
                  { _.map(URGENCIES, (item) => (<RadioButton value={item} label={item} key={item} />)) }
                </RadioButtonGroup>
              </div>

              <div className="left col-12 mb2">
                <div className="mb1 bold">Certainty</div>
                <RadioButtonGroup name="certainty" onChange={this.updateField.bind(this, 'certainty')}>
                  { _.map(CERTAINTIES, (item) => (<RadioButton value={item} label={item} key={item} />)) }
                </RadioButtonGroup>
              </div>

              <div className="left col-8 mb2">
                <div className="mb1 bold">Instructions</div>
                { this.state.selected.instructions || 'Please describe what needs to be done to avoid this emergency' }
              </div>

              <div className="left col-12">
                <RaisedButton label="Discard" onClick={this.discard} className="right ml1" />
                <RaisedButton label="Approve" primary={true} onClick={this.approve} className="right" />
              </div>
            </div>

          </div>)
        }


      </div>
    )
  }
}

export default Admin
