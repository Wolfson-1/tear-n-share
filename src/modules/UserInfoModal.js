import React, { useEffect,useState } from 'react'
import { db } from '../firebase/config';
import useFetchDocsFilter from '../hooks/useFetchDocsFilter'
import useAddDoc from '../hooks/useAddDoc';
import AdvertListItem from './multi-use-modules/AdvertListItem';

export default function UserInfoModal({focusProfile,setFocusProfile}) {  

/* state
----------- */

// state for variables to send adver requests
const [userRequest,setUserRequest] = useState(null);
const [requestAdPath,setRequestAdPath] = useState([]);

/* Hooks 
----------*/

//hook to fetch active advert data
const adverts = useFetchDocsFilter(db,['userData',focusProfile.id,'adverts'],'active',true);
//hook to send request to user on click
const adRequestDoc  = useAddDoc(userRequest,db,['userData',...requestAdPath]);

/* useEffects */

//check for when updateDistance is complete to clear out state for updateFig
useEffect(() => {
    if(adRequestDoc.isComplete === true) setUserRequest(null);
},[adRequestDoc.isComplete])

 /* event handlers 
----------------------*/

const submitAdvertRequest = (user,requestAdPath) => {
    setRequestAdPath(requestAdPath);
    setUserRequest([{requestUserId:user.userUid,
                    displayName:user.displayName,
                    distance:focusProfile.distance,
                    status:'pending'}]);
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
