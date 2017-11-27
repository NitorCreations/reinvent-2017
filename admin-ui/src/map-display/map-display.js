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
    defaultCenter={props.positions[0]}
  >
    {props.positions.map(pos => (
      <Marker key={JSON.stringify(pos)}
        position={pos}
      />

    ))}
  </GoogleMap>
))

export default MapDisplay