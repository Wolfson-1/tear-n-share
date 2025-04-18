import React, {useEffect, useState} from 'react'
import {db} from '../../../../../firebase/config';
import useAddDoc from '../../../../../hooks/useAddDoc';
import PurchaseForm from './PurchaseForm';
import PaymentForm from './PaymentForm';
import useUpdateDocs from '../../../../../hooks/useUpdateDocs';

export default function LogEventModal({unpaid,eventType,setLogEvent,uploadPath,user}) {
    //uplaodPathIds need to be set in following format for use in uplaodEvent hook: {sharedData:'',advert:''}

    // State for use in firebase hooks to upload new data based on form
    const [uploadObj,setUploadObj] = useState(null);
    //state for object of events to update paid status
    const [updateObj,setUpdateObj] = useState({})
    //formError state
    const [formError,setFormError] = useState(false);
 
    /* Hooks
    ----------------------*/
    const uploadEvent = useAddDoc(uploadObj,db,['sharedUserData',uploadPath.sharedData,'matchedAdverts',uploadPath.advert,'advertLogs']);
    const updatePaid = useUpdateDocs(updateObj.updateData,db,['sharedUserData',uploadPath.sharedData,'matchedAdverts',uploadPath.advert,'advertLogs'],updateObj.ids);

    //listen to if hook isCompleted status for further actions following completion. 
    useEffect(()=>{
        //if upload object has completed following submit. Close modal.
        if(uploadEvent.isComplete === true) {
            setLogEvent(null);
        }
    },[uploadEvent.isComplete]);

    //listen to when updaitPaid hooks is completed. then set object to upload payment event to events.
    useEffect(()=>{
        //if action to update paid status is complete. set a paid event object to upload
        if(updatePaid.isComplete === true) {
            //date & set format for use in calander
            const date = new Date();
            const day = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`
            const month = date.getMonth() > 10 ? date.getMonth()+1 : `0${date.getMonth()+1}`

            setUploadObj([{
                eventType:eventType,
                eventUser: user.displayName,
                eventUserId:user.userUid,
                eventDate:`${date.getFullYear()}-${month}-${day}`,
                purchasesPaid:updateObj.ids
            }]);
        }
    },[updatePaid.isComplete])

    return (
    <div className='modal-background'>
        <div className='modal-form-container log-event-modal'>
            <div className='modal-header'>
                    <h2>Log {eventType}</h2>
                    <button className='close-modal' onClick={()=>{setLogEvent(null)}}>x</button>
            </div>
        {eventType === 'purchase' && <PurchaseForm user={user} setUploadObj={setUploadObj} setFormError={setFormError}/>}
        {eventType === 'payment' && <PaymentForm unpaid={unpaid} setUpdateObj={setUpdateObj}/>}
        {formError && <p>Please fill in all inputs</p>}
        </div>
    </div>
  )
}
