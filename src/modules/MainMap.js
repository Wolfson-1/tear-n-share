import React, {useContext,useEffect,useState} from 'react'
import {ContextUser} from '../context/ContextUser';
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer, ZoomControl} from 'react-leaflet';
import useWindowDimentions from '../hooks/useWindowDimentions';
import geoLocation from '../utils/geoLocation';

export default function MainMap({setUpdateData,userData}) {
  //access user status from context
  const user = useContext(ContextUser);  
  
  /*State
    -------------------- */

    //state for map dinmentions
    const {width,height} = useWindowDimentions();
    //state for current location
    const [location,setLocation] = useState(userData && userData.location);

    /*useEffects
    -------------------- */

    useEffect(() => {
      //set location data on first render
      geoLocation().then(data => {
        //if location data doesnt exist update to current location
        if(!userData.location) setUpdateData({location:data})
        //if location data differs to user data update location
        if(userData.location.lat !== data.lat || userData.location.long !== data.long) {
          setUpdateData({location:data});
        }
      }); 
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

  return (
  <div className={'main-map-container'} style={{width: width + 'px', height:height + 'px'}}>
    <MapContainer style={{width: '100%', height: '100%'}} center={[location.lat.toString(),location.long.toString()]} zoom={13} zoomControl={false} scrollWheelZoom={true} id='main-map'>
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <ZoomControl position="bottomright" zoomInText="+" zoomOutText="-" />
  </MapContainer>
  </div>
  )
}
