import React, { useState,useContext } from 'react'
import {db} from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import useFetchDocs from '../../../hooks/useFetchDocs';
import AdvertList from './AdvertList';
import NewAdvertModal from './NewAdvertModal';

export default function AdvertSection() {

  const user = useContext(ContextUser);

  // state for modal to add a new advert
  const [newAdvert, setNewAdvert] = useState(false);

  // pull data for current adds dependant on user
  const adData = useFetchDocs(db,['userData',user.userUid,'activeAdverts'],['createdAt','desc']);

  console.log(adData);

  return (
    <div className='buddies-container advert'>
      {adData && <AdvertList adverts={adData}/>}
      <div className='add-advert'>
        <button onClick={() => {setNewAdvert(true)}}>
          +
        </button>
      </div>
      {newAdvert ? <NewAdvertModal closeModal={setNewAdvert}/> : null}
    </div>
  )
}