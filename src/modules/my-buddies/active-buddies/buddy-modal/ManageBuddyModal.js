import React, {useState} from 'react';
import {db} from '../../../../firebase/config';
import useFetchDocs from '../../../../hooks/useFetchDocs';
import useFetchDoc from '../../../../hooks/useFetchDoc';
import BuddyModal from './BuddyModal';
import BuddyAdvertModal from './BuddyAdvertModal';

export default function ManageBuddyModal({manageBuddy,setManageBuddy,setMainSelector}) {
    /* State
    -------------*/
    const [manageAd,setManageAd] = useState(null);

    /* hooks
    ------------ */
    //hook to retreive matched adverts with buddy & current buddy data
    const matchUserInfo = useFetchDoc(db,['sharedUserData'],manageBuddy.id);
    const matchedAdverts = useFetchDocs(db,['sharedUserData',manageBuddy.id,'matchedAdverts'],["createdAt"]);

    return (
        <div className='modal-background'>
        <div className={manageAd ? 'modal-form-container buddy-container' : 'modal-form-container user-container'}>
            <button className='close-modal' onClick={()=>{setManageBuddy(null)}}>x</button> 
            <div className='user-info'>
                <img alt='profile picture'></img>
                <h1>{manageBuddy.displayName}</h1>
                <button onClick={()=>{setMainSelector('chat')}}>Chat</button>
            </div>
            {matchedAdverts && !manageAd && <BuddyModal matchedAdverts={matchedAdverts} manageBuddy={manageBuddy} setManageAd={setManageAd}/>}
            {matchUserInfo && manageAd && <BuddyAdvertModal matchUserInfo={matchUserInfo} advert={manageAd} setManageAd={setManageAd}/>}
        </div>
      </div>
  )
}