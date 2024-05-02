import React, { useState,useContext } from 'react'
import {db} from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import useFetchDocs from '../../../hooks/useFetchDocs';
import AdvertList from './AdvertList';
import NewAdvertModal from './NewAdvertModal';

export default function AdvertSection() {

  const user = useContext(ContextUser);

  // state for advert modal to add a new advert
  const [advertModal, setAdvertModal] = useState(false);
  const [existingAdId,setExistingAdId] = useState(null);  

  // pull data for current ads dependant on user
  const adData = useFetchDocs(db,['userData',user.userUid,'activeAdverts'],['createdAt','desc']);

  return (
    <div className='buddies-container advert'>
      {adData && <AdvertList adverts={adData} setAdvertModal={setAdvertModal} setExistingAdId={setExistingAdId}/>}
      <div className='add-advert'>
        <button onClick={() => {setAdvertModal(true)}}>
          +
        </button>
      </div>
      {advertModal ? <NewAdvertModal closeModal={setAdvertModal} advertId={existingAdId} setAdvertId={setExistingAdId}/> : null}
    </div>
  )
}