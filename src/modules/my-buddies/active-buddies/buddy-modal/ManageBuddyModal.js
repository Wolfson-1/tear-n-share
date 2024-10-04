import React, {useContext, useState} from 'react';
import {ContextUser} from '../../../../context/ContextUser';
import {db} from '../../../../firebase/config';
import useFetchDocs from '../../../../hooks/useFetchDocs';
import BuddyModal from './BuddyModal';
import BuddyAdvertModal from './BuddyAdvertModal';

export default function ManageBuddyModal({manageBuddy, setManageBuddy}) {
    // context for user
    const user = useContext(ContextUser);

    /* State
    -------------*/
    const [manageAd,setManageAd] = useState(null);

    /* hooks
    ------------ */
    //hook for matched adverts
    const matchedAdverts = useFetchDocs(db,['userData',user.userUid,'activeBuddies',manageBuddy.id,'matchedAdverts'],["createdAt"]);

    return (
        <div className='modal-background'>
        <div className='modal-form-container user-container'>
            <button className='close-modal' onClick={()=>{setManageBuddy(null)}}>x</button>
            {matchedAdverts && !manageAd && <BuddyModal matchedAdverts={matchedAdverts} manageBuddy={manageBuddy} setManageAd={setManageAd}/>}
            {matchedAdverts && manageAd && <BuddyAdvertModal advert={manageAd} setManageAd={setManageAd}/>}
        </div>
      </div>
  )
}