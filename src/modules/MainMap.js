import React, {useContext,useEffect,useState} from 'react'
import {ContextUser} from '../context/ContextUser';
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer, ZoomControl,Circle,Marker, Popup} from 'react-leaflet';
import {Icon} from 'leaflet';
import useWindowDimentions from '../hooks/useWindowDimentions';
import geoLocation from '../utils/geoLocation';
import useUserDist from '../hooks/useUserDist';

export default function MainMap({setUpdateData,setNewUser,userData,visibleUsers,setUserModal}) {
  //access user status from context
  const user = useContext(ContextUser);  
  
  // custom map icon  
  const userIcon = new Icon({
    iconUrl:'https://cdn-icons-png.flaticon.com/512/3425/3425073.png',
    iconSize:[38,38]
    });

  const visUserIcon = new Icon({
    iconUrl:'https://cdn-icons-png.flaticon.com/512/5193/5193184.png',
    iconSize:[38,38]
  })

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

    /* hooks 
    -------------------- */
    
    const filteredUsers = useUserDist(userData.location,userData.distance,visibleUsers);

    /*useEffects
    -------------------- */
    // set initial data needed for map location on initial render
    useEffect(() => {
      //set location data on first render
      geoLocation().then(data => {
        //if location data doesnt exist or differs to current userdata, update location
        if(!userData.location) {
          console.log(user.displayName)
          setNewUser([{displayName: user.displayName, location:data, show:true}]);
        } else if (userData.location.lat !== data.lat || userData.location.lng !== data.lng) {
          setUpdateData({location:data});
        }
      });
    },[]);

  //update distance & location values for map when userData changes
  useEffect(() => {
    if (userData.distance && userData.location) {
      if(userData.distance !== distance) setDistance(userData.distance);
      if(userData.location.lat !== location.lat || userData.location.lng !== location.lng) setLocation(userData.location);
    } 
  }, [userData]);

  //Convert & set radius for map circle layer based on user set distance prefference change
  useEffect(() => {
    const mInMile = 1609.344 // number of meters in a mile
    if (userData.distance) {
      console.log(userData.distance)
      const mDist = userData.distance * mInMile;
      console.log(userData.distance);
      console.log(mDist);
      setCircleRadius(mDist); 
    }  
  },[distance]);

  /* -------------------- */

  return (
  <div className={'main-map-container'} style={{width: width + 'px', height:height + 'px'}}>
    <MapContainer style={{width: '100%', height: '100%'}} center={location ? [location.lat.toString(),location.lng.toString()] : ['51.5032','0.1195']} zoom={13} zoomsnap={0.25} zoomControl={false} scrollWheelZoom={true} id='main-map'>
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <ZoomControl position="bottomright" zoomInText="+" zoomOutText="-" />
      {userData.location && <Circle center={userData.location} fillColor="blue" radius={circleRadius}/>}
      {userData.location && <Marker position={userData.location} icon={userIcon}/>}
      {filteredUsers && filteredUsers.map((visUser)=>{
       return <Marker position={visUser.location} icon={visUserIcon}>
                <Popup>
                {visUser.displayName} <br/> 
                Distance: {Math.round(visUser.distToUser * 100) / 100} <br/>
                <button onClick={() => {setUserModal(visUser)}}>More info</button>
                </Popup>
              </Marker>
      })}
  </MapContainer>
  </div>
  )
};