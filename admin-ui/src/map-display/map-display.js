import React from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
// { lat: -34.397, lng: 150.644 }
const MapDisplay = withScriptjs(withGoogleMap(props => {
  const { lat, lng } = props.positions && props.positions[0]

  return (<GoogleMap
    defaultZoom={10}
    defaultCenter={props.positions[0]}
    ref={(map) => map && map.panTo({ lat, lng })}
  >
    {props.positions.map(pos => (
      <Marker key={JSON.stringify(pos)}
        position={pos}
      />

    ))}
  </GoogleMap>)
}))

export default MapDisplay