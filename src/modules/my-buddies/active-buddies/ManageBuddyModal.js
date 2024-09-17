import React, {useContext} from 'react';
import {ContextUser} from '../../../context/ContextUser';
import {db} from '../../../firebase/config';
import useFetchDocs from '../../../hooks/useFetchDocs';
import BuddyAdListItem from './BuddyAdListItem';

export default function ManageBuddyModal({manageBuddy, setManageBuddy}) {
    // context for user
    const user = useContext(ContextUser);
    console.log(manageBuddy)
    //hook for matched adverts
    const matchedAdverts = useFetchDocs(db,['userData',user.userUid,'activeBuddies',manageBuddy.id,'matchedAdverts'],["createdAt"]);

    return (
        <div className='modal-background'>
        <div className='modal-form-container user-container'>
              <button className='close-modal' onClick={()=>{setManageBuddy(null)}}>x</button>
              <img alt='profile picture'></img>
              <h1>{manageBuddy.displayName}</h1>     
              <div className='advert-section'>
                  <h3>Adverts</h3>
                  <div className='advert-list-container'>
                      {<div className='advert-list'>
                        {matchedAdverts && matchedAdverts.map((advert)=>{
                            return <BuddyAdListItem advert={advert}/>
                        })}
                      </div>}
                  </div>
              </div>
        </div>
      </div>
  )
}