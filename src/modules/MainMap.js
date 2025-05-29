import React, {useContext,useEffect,useState} from 'react'
import {ContextUser} from '../context/ContextUser';
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer, ZoomControl,Circle,Marker, Popup} from 'react-leaflet';
import {Icon} from 'leaflet';
import useWindowDimentions from '../hooks/useWindowDimentions';
import geoLocation from '../utils/geoLocation';
import useUserDist from '../hooks/useUserDist';

export default function MainMap({setUpdateData,userData,visibleUsers,setUserModal}) {
  //access user status from context
  const user = useContext(ContextUser);  
  
  console.log('map running');
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
    const [location,setLocation] = useState(userData.location);
    //user distance
    const [distance,setDistance] = useState(userData.distance);
    //user circle radius in M
    const [circleRadius,setCircleRadius] = useState(null); 
    const [mapBounds,setMapBounds] = useState(null);

    /* hooks 
    -------------------- */

    const filteredUsers = useUserDist(location, distance, visibleUsers);

    /*useEffects
    -------------------- */
    // set initial data needed for map location on initial render
    useEffect(() => {
      //set location data on first render
      geoLocation().then(data => {
        if (
          !userData.location ||
          userData.location.lat !== data.lat ||
          userData.location.lng !== data.lng
        ) {
          setUpdateData({ location: data });
        }
      }) //if there is an error in fetching geoLocation. set backup co-ordinates.
      .catch(() => {
        // fallback location (e.g., Southampton or UK center)
        const fallback = { lat: 0.0, lng: 180.0 };
  
        if (
          !userData.location ||
          userData.location.lat == '' ||
          userData.location.lng == ''
        ) {
          setUpdateData({ location: fallback });
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
      const mDist = userData.distance * mInMile;
      setCircleRadius(mDist); 
    }
  },[distance]);

  //useEffect to run on set of location to create map bounds so user cant scroll across whole planet.
  useEffect(()=>{
    if(location) {
      //init vaeriable for DD sw & ne lat long co-ordinates for setting broad mapBoundaries
      const swLatLong = [(location.lat-0.5),(location.lng-1)];
      const neLatLong = [(location.lat+0.5),(location.lng+1)];

      //set state for MapBounds
      setMapBounds({swLatLong:swLatLong,neLatLong:neLatLong});
    }
  },[location])

  /* -------------------- */

  return (
    <div className={'main-map-container'} style={{width: width + 'px', height:height + 'px'}}>
    {mapBounds && location &&
    <MapContainer style={{width: '100%', height: '100%'}} center={location} maxBounds={[mapBounds.swLatLong,mapBounds.neLatLong]} maxBoundsViscosity={1.0} zoom={13} minZoom={8} zoomsnap={0.25} zoomControl={false} scrollWheelZoom={true} id='main-map'>
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <ZoomControl position="bottomright" zoomInText="+" zoomOutText="-" />
      <Circle center={location} fillColor="blue" radius={circleRadius}/>
      <Marker position={location} icon={userIcon}/>
      {filteredUsers && filteredUsers.map((visUser)=>{
       return <Marker position={visUser.location} icon={visUserIcon}>
                <Popup>
                  <picture className='profile-img'>
                    <img src={'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png'} alt='acc-img'></img> 
                  </picture>
                  <h3>{visUser.displayName}</h3>
                  <div className='spacer'></div>
                  <p>Distance: {Math.round(visUser.distToUser * 100) / 100}</p>
                  <button onClick={() => {setUserModal(visUser)}}>More info</button>
                </Popup>
              </Marker>
      })}
    </MapContainer>}
  </div>
  )
};