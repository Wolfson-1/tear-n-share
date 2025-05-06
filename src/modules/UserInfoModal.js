import React, { useContext, useEffect,useState } from 'react'
import { db } from '../firebase/config';
import {ContextUser} from '../context/ContextUser';
import { ContextNotification } from '../context/ContextNotification';
import useFetchDocsFilter from '../hooks/useFetchDocsFilter'
import useAddDoc from '../hooks/useAddDoc';
import AdvertListItem from './multi-use-modules/AdvertListItem';

export default function UserInfoModal({focusProfile,setFocusProfile}) {  
//access user status & notifications update state from context
const user = useContext(ContextUser);
const notificationsUpdate = useContext(ContextNotification);

/* state
----------- */

// state for variables to send advert requests
const [userRequest,setUserRequest] = useState(null);
const [requestAdPath,setRequestAdPath] = useState([]);
const [requestTracker,setRequestTracker] = useState(null);

/* Hooks 
----------*/

//hook to fetch active advert data
const adverts = useFetchDocsFilter(db,['userData',focusProfile.id,'adverts'],'active',true);
//hook to send request to receiving user advert
const adRequestDoc  = useAddDoc(userRequest,db,['userData',...requestAdPath]);
//hook to log request tracker for user when advert request made
const userRequestTracker = useAddDoc(requestTracker,db,['userData',user.userUid,'sentRequests']);

/* useEffects */

//check for when updateDistance is complete to clear out state for updateFig
useEffect(() => {
    if(adRequestDoc.isComplete === true) setUserRequest(null);
    if(userRequestTracker.isComplete === true) setRequestTracker(null);
},[adRequestDoc.isComplete,userRequestTracker.isComplete])

 /* event handlers 
----------------------*/

//event handler passed down for advert list item to send requests to other users
const submitAdvertRequest = (user,adUser,advert,requestAdPath) => {
    //current epoch date & time
    const currTime = Date.now();

    // Set request path & request obkect to send advert to user
    setRequestAdPath(requestAdPath);
    setUserRequest([{requestUserId:user.userUid,
                    adId: advert.id,
                    basicAdInfo:`Bread: ${advert.breadType} | Type: ${advert.loafType} | Sliced: ${advert.sliced.map((item)=>item)} | Store: ${advert.stores.map((item)=>item)}`,
                    displayName:user.displayName,
                    distance:focusProfile.distance,
                    status:'pending',
                    requestTime:currTime}]);

    //set request tracker object for logged in user
    setRequestTracker([{adUserId:adUser.id,
        adId: advert.id,
        basicAdInfo:`Bread: ${advert.breadType} | Type: ${advert.loafType} | Sliced: ${advert.sliced.map((item)=>item)} | Store: ${advert.stores.map((item)=>item)}`,
        displayName:adUser.displayName,
        distance:adUser.distance,
        status:'pending',
        requestTime:currTime}]);

    //set Reducer state using context for sending a notification of a new request
    notificationsUpdate.updateDispatch( {type:'add-notification',
        payload:{type:'advert-request-notification',
                userId: user.userUid,
                userName: user.displayName,
                adId:advert.id
                },
        sendId:adUser.id
        });

};

return (
    <div className='modal-background'>
      <div className='modal-form-container user-container'>
            <button className={'close-modal'} onClick={()=>{setFocusProfile(null)}}>x</button>
            <img alt='profile picture'></img>
            <h1>{focusProfile.displayName}</h1>
            <h3>Distance: {Math.round(focusProfile.distToUser * 100) / 100}</h3>        
            <div className={'advert-section'}>
                <h3>Adverts</h3>
                <div className='advert-list-container'>
                    {adverts && <div className='advert-list'>
                        {adverts.map((advert)=> {
                            return <AdvertListItem focusProfile={focusProfile} advert={advert} requestEventHandler={submitAdvertRequest}/>
                        })}   
                    </div>}
                </div>
            </div>
      </div>
    </div>
  )
}
