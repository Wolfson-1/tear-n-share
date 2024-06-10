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
    //user circle radius in M
    const [circleRadius,setCircleRadius] = useState(null); 

    /*useEffects
    -------------------- */
    // set initial data needed for map & layer rendering on first initial render
    useEffect(() => {
      //set location data on first render
      geoLocation().then(data => {
        //if location data doesnt exist update to current location
        if(!userData.location) setUpdateData({location:data})
        //if location data differs to user data update location
        if(userData.location.lat !== data.lat || userData.location.lng !== data.lng) {
          setUpdateData({location:data});
        }
      }); 

      //convert & set radius for map circle layer based on user set distance prefference
      const mInMile = 1609.344 // number of meters in a mile
      const mDist = userData.distance * mInMile;
      setCircleRadius(mDist);
    },[]);

  // set initial user values once userData has loaded if needed
  useEffect(() => {
    //if there is no value for show for user data set as current location 
    if(userData && userData.distance === undefined) setUpdateData({location: location});

    //if user data exists set distance values for DOM loading or set to 0
    if(userData) {
      setLocation(userData.location)
    };
  }, [userData])

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
