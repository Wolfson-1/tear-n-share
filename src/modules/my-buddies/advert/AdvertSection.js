import React, { useState,useContext, useEffect } from 'react'
import {db} from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import useFetchDocsFilter from '../../../hooks/useFetchDocsFilter';
import useAddDoc from '../../../hooks/useAddDoc';
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
  // State for use in firebase hooks to upload new data based on form
  const [uploadData,setUploadData] = useState(null);

  /* Hooks
  ----------------------*/
  
  // pull data for current ads dependant on user
  const adData = useFetchDocsFilter(db,['userData',user.userUid,'adverts'],'active',activeStatus);

  //updating ad data (new data & advert active status) 
  const updateExistingAd = useUpdateDoc(updateData,db,['userData',user.userUid,'adverts',existingAdId]);

  // hooks for addition of formData to userDatabse
  const uploadNewAd = useAddDoc(uploadData,db,['userData',user.userUid,'adverts']);


  /* useEffects
  ----------------------*/

  // useEffect to close out modal & clear selected ad ID if update of ad data is complete
  useEffect(() => {
  if (updateExistingAd.isComplete === true) {
    setUpdateData(null);
    setExistingAdId(null);
    setAdvertModal(false);
   };

  if(uploadNewAd.isComplete === true) {
      setUploadData(null);
  };
  },[updateExistingAd.isComplete,uploadNewAd.isComplete]);

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
      <div className='active-inactive-toggle'>
        <button className={activeStatus === true ? 'active' : 'inactive'} onClick={()=>{if(activeStatus !== true) setActiveStatus(true)}}>Active adverts</button>
        <p>|</p>
        <button className={activeStatus === false ? 'active' : 'inactive'} onClick={()=>{if(activeStatus !== false) setActiveStatus(false)}}>Deactivated Adverts</button>
      </div>
      <div className='listed-adverts-container'>
        {adData && <AdvertList adverts={adData} activeStatus={activeStatus} editAd={editAd} toggleAd={toggleAd}/>}
      </div>
      {activeStatus === true && <div className='add-advert'>
        <button className='add-button' onClick={() => {setAdvertModal(true)}}>
          +
        </button>
      </div>}
      {advertModal && <NewAdvertModal closeModal={setAdvertModal} advertId={existingAdId} setUploadData={setUploadData} setUpdateData={setUpdateData}/>}
    </div>
  )
}