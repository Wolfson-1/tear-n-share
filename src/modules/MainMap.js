import React from 'react'
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer} from 'react-leaflet';

export default function MainMap() {
  return (
    <MapContainer center={['50.931998','-1.204089']} zoom={13} scrollWheelZoom={true} id='main-map'>
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
    </MapContainer>
  )
}
