import React, { useState,useContext, useEffect } from 'react'
import {db} from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import useFetchDocsFilter from '../../../hooks/useFetchDocsFilter';
import useUpdateDoc from '../../../hooks/useUpdateDoc';
import AdvertList from './AdvertList';
import NewAdvertModal from './NewAdvertModal';

export default function AdvertSection() {

  const user = useContext(ContextUser);

  /* State 
  ----------------------*/

  // state for advert modal to add a new advert
  const [advertModal, setAdvertModal] = useState(false);
  const [existingAdId,setExistingAdId] = useState(null);
  const [activeStatus,setActiveStatus] = useState(true);

  //state to update ad data for active status & changes to info on edit.
  const [updateData,setUpdateData] = useState(null);

  /* Hooks
  ----------------------*/
  
  // pull data for current ads dependant on user
  const adData = useFetchDocsFilter(db,['userData',user.userUid,'adverts'],'active',activeStatus);

  //updating ad data (new data & advert active status) 
  const updateExistingAd = useUpdateDoc(updateData,db,['userData',user.userUid,'adverts',existingAdId]);

  /* useEffects
  ----------------------*/

  // useEffect to close out modal & clear selected ad ID if update of ad data is complete
  useEffect(() => {
    // if condition for completion of setting an advert to active
   if(updateExistingAd.isComplete === false) {
    return;
   }
   
   if (updateExistingAd.isComplete === true) {
    setUpdateData(null);
    setExistingAdId(null);
   };
  },[updateExistingAd.isComplete]);

  /* functions for advert manipulation
  ------------------------------------------*/

  //update active staus of advert either by reactivating or discarding
    const toggleAd = (id,status) => {
      setExistingAdId(id);
      setUpdateData({active:status});
  };

  //repoen modal for new advert with loaded ad data of existing ad to edit
    const editAd = (id) => {
        setExistingAdId(id);
        setAdvertModal(true);
    };
  
  return (
    <div className='buddies-container advert'>
      <div>
        <button onClick={()=>{if(activeStatus !== true) setActiveStatus(true)}}>Active adverts</button>
        <button onClick={()=>{if(activeStatus !== false) setActiveStatus(false)}}>Deactivated Adverts</button>
      </div>
      {adData && <AdvertList adverts={adData} activeStatus={activeStatus} editAd={editAd} toggleAd={toggleAd}/>}
      {activeStatus === true && <div className='add-advert'>
        <button onClick={() => {setAdvertModal(true)}}>
          +
        </button>
      </div>}
      {advertModal ? <NewAdvertModal closeModal={setAdvertModal} advertId={existingAdId} setAdvertId={setExistingAdId} setUpdateData={setUpdateData}/> : null}
    </div>
  )
}