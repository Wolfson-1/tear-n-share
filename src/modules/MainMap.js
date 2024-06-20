import React, {useContext,useEffect,useState} from 'react'
import {ContextUser} from '../context/ContextUser';
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer, ZoomControl,Circle,Marker} from 'react-leaflet';
import {Icon} from 'leaflet';
import useWindowDimentions from '../hooks/useWindowDimentions';
import geoLocation from '../utils/geoLocation';

export default function MainMap({setUpdateData,userData}) {
  //access user status from context
  const user = useContext(ContextUser);  
  
  // custom map icon  
  const mapIcon = new Icon({
    iconUrl:'https://cdn-icons-png.flaticon.com/512/3425/3425073.png',
    iconSize:[38,38]
    });

  /*State
    -------------------- */

    //map dinmentions
    const {width,height} = useWindowDimentions();
    //current location
    const [location,setLocation] = useState(userData && userData.location);
    //user distance
    const [distance,setDistance] = useState(userData && userData.distance);
    //user circle radius in M
    const [circleRadius,setCircleRadius] = useState(null); 

    /*useEffects
    -------------------- */
    // set initial data needed for map location on initial render
    useEffect(() => {
      //set location data on first render
      geoLocation().then(data => {
        //if location data doesnt exist or differs to current userdata, update location
        if(!userData.location || userData.location.lat !== data.lat || userData.location.lng !== data.lng) {
          setUpdateData({location:data});
        }
      });
    },[]);

  //update distance & location values for map when userData changes
  useEffect(() => {
    if(userData.distance !== distance) setDistance(userData.distance);
    if(userData.location.lat !== location.lat || userData.location.lng !== location.lng) setLocation(userData.location);
  }, [userData]);

  //Convert & set radius for map circle layer based on user set distance prefference change
  useEffect(() => {
    const mInMile = 1609.344 // number of meters in a mile
    const mDist = userData.distance * mInMile;
    setCircleRadius(mDist);
  },[distance]);

  /* -------------------- */

  return (
  <div className={'main-map-container'} style={{width: width + 'px', height:height + 'px'}}>
    <MapContainer style={{width: '100%', height: '100%'}} center={[location.lat.toString(),location.lng.toString()]} zoom={13} zoomsnap={0.25} zoomControl={false} scrollWheelZoom={true} id='main-map'>
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <ZoomControl position="bottomright" zoomInText="+" zoomOutText="-" />
      <Circle center={userData.location} fillColor="blue" radius={circleRadius}/>
      <Marker position={userData.location} icon={mapIcon}/>
  </MapContainer>
  </div>
  )
}
