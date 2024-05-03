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
  const [activeStatus,setActiveStatus] = useState('activeAdverts')

  // pull data for current ads dependant on user
  const adData = useFetchDocs(db,['userData',user.userUid],['createdAt','desc'],activeStatus);

  return (
    <div className='buddies-container advert'>
      <div>
        <button onClick={()=>{if(activeStatus !== 'activeAdverts') setActiveStatus('activeAdverts')}}>Active adverts</button>
        <button onClick={()=>{if(activeStatus !== 'inactiveAdverts') setActiveStatus('inactiveAdverts')}}>Deactivated Adverts</button>
      </div>
      {adData && <AdvertList adverts={adData} setAdvertModal={setAdvertModal} setExistingAdId={setExistingAdId} activeStatus={activeStatus}/>}
      {activeStatus === 'activeAdverts' && <div className='add-advert'>
        <button onClick={() => {setAdvertModal(true)}}>
          +
        </button>
      </div>}
      {advertModal ? <NewAdvertModal closeModal={setAdvertModal} advertId={existingAdId} setAdvertId={setExistingAdId}/> : null}
    </div>
  )
}