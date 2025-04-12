import React, {useEffect, useState, useContext} from 'react'
import {db} from '../../../../../firebase/config';
import {ContextUser} from '../../../../../context/ContextUser';
import useAddDoc from '../../../../../hooks/useAddDoc';
import PurchaseForm from './PurchaseForm';
import PaymentForm from './PaymentForm';
import useUpdateDoc from '../../../../../hooks/useUpdateDoc';
import { updateProfile } from 'firebase/auth';

export default function LogEventModal({unpaid,eventType,setLogEvent,uploadPath}) {
    //uplaodPathIds need to be set in following format for use in uplaodEvent hook: {sharedData:'',advert:''}

    // context for user
    const user = useContext(ContextUser);


    // State for use in firebase hooks to upload new data based on form
    const [uploadObj,setUploadObj] = useState(null);
    const [updateCost,setUpdateCost] = useState(null);
    //formError state
    const [formError,setFormError] = useState(false);
 
    /* Hooks
    ----------------------*/
    const uploadEvent = useAddDoc(uploadObj,db,['sharedUserData',uploadPath.sharedData,'matchedAdverts',uploadPath.advert,'advertLogs']);
    const updateCosts = useUpdateDoc(updateCost,db,['sharedUserData',uploadPath.sharedData,'matchedAdverts',uploadPath.advert]);

    //listen to if uplaodEvent is compleated. if uplaod has completed following submit. Close modal.
    useEffect(()=>{
        if(uploadEvent.isComplete === true) {
            setLogEvent(null);
        }
        if(updateCost === true) {
            setUpdateCost(null);
        }
    },[uploadEvent.isComplete,updateCost]);
  
    return (
    <div className='modal-background'>
        <div className='modal-form-container log-event-modal'>
            <div className='modal-header'>
                    <h2>Log {eventType}</h2>
                    <button className='close-modal' onClick={()=>{setLogEvent(null)}}>x</button>
            </div>
        {eventType === 'purchase' && <PurchaseForm user={user} setUploadObj={setUploadObj} setFormError={setFormError}/>}
        {eventType === 'payment' && <PaymentForm unpaid={unpaid} setUploadObj={setUploadObj} setFormError={setFormError} />}
        {formError && <p>Please fill in all inputs</p>}
        </div>
    </div>
  )
}
