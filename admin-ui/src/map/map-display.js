import React, { Component } from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
// { lat: -34.397, lng: 150.644 }
const MapDisplay = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={props.position}
  >
    <Marker
      position={props.position}
    />
  </GoogleMap>
))

  /*

<MapWithAMarker
  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `400px` }} />}
  mapElement={<div style={{ height: `100%` }} />}

*/
export default MapDisplay