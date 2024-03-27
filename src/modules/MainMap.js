import React, { useEffect, useState } from 'react'
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer} from 'react-leaflet';
import useWindowDimentions from '../hooks/useWindowDimentions';

export default function MainMap() {

    //state for map dinmentions
    const {width,height} = useWindowDimentions();

  return (
  <div style={{width: width + 'px', height:height + 'px'}}>
    <MapContainer style={{width: '100%', height: '100%'}} center={['50.931998','-1.204089']} zoom={13} scrollWheelZoom={true} id='main-map'>
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
  </MapContainer>
  </div>
  
  )
}
