import React, {useEffect, useState, useContext} from 'react'
import {db} from '../../../../firebase/config';
import {ContextUser} from '../../../../context/ContextUser';
import * as formHandlingUtils from '../../../../utils/formHandlingUtils';
import useAddDoc from '../../../../hooks/useAddDoc';

export default function LogEventModal({eventType,setLogEvent,uploadPath}) {
    //uplaodPathIds need to be set in following format for use in uplaodEvent hook: {sharedData:'',advert:''}

    // context for user
    const user = useContext(ContextUser);

    /* State
    ----------------------*/
    // State for form inputs & form error handling
    const [formData,setFormData] = useState({purchaseDate:'',purchaseDiff:false, purchasePrice:''});
    const [formError,setFormError] = useState(null);

    // State for use in firebase hooks to upload new data based on form
    const [uploadObj,setUploadObj] = useState(null);

    /* Hooks
    ----------------------*/
    const uploadEvent = useAddDoc(uploadObj,db,['sharedUserData',uploadPath.sharedData,'matchedAdverts',uploadPath.advert,'advertLogs']);

    /* Form handling
    -----------------------*/
    const handleSubmit = (e) =>{
        e.preventDefault();
        
        //init local variable for errors & clear error state for any previous existing error
        let error = false;
        setFormError(null);

        // loop through form data to load form inputs & input type into fieldsCheckArr
        for (let i = 0; i < e.target.form.length - 1; i++) {
            // if logic to ensure no duplicates are added (where multiple options exist for checkboxes)
            if(formData[e.target.form[i].id] === undefined || formData[e.target.form[i].id] === null || formData[e.target.form[i].id] === '') {
                error = true
                return;
            }
        };

        //If error is true, set formError for display in dom and return.
        if(error) {
            setFormError(true);
            return;
        }

        //set formData for upload including user data for who logged event
        setUploadObj([{
                    eventType:eventType,
                    eventUser:user.displayName, 
                    eventUserId:user.userUid,
                     ...formData}]);
    };


    /*useEffect
    ---------------------*/
    //to clear out diffReasoning value if user unchecks the purchase difference checkbox after previously checking it & inputing values for diffReasoning
    useEffect(()=>{
        //if logic to clear reasoning field if purchase diff was ticked as true then user changes this to false.
        if(formData.purchaseDiff === false && formData.diffReasoning) {
            //desructure current object in setFormData to remove diffReasoning key
            setFormData(current => {
                // remove cost key from object
                const {diffReasoning, ...rest} = current;
                return rest;
            });
        }
    },[formData]);

    //listen to if uplaodEvent is compleated. if uplaod has completed following submit. Close modal.
    useEffect(()=>{
        if(uploadEvent.isComplete === true) {
            setLogEvent(null);
        }
    },[uploadEvent.isComplete]);
  
    return (
    <div className='modal-background'>
        <div className='modal-form-container log-event-modal'>
            <div className='modal-header'>
                    <h2>Log {eventType}</h2>
                    <button className='close-modal' onClick={()=>{setLogEvent(null)}}>x</button>
            </div>
        {eventType === 'purchase' &&
        <form className='log-event-form purchase'>
            <label>
                Purchase different from advert specifications?
                <input id='purchaseDiff' type='checkbox' checked={formData.purhcaseDiff} onChange={(e) => {
                                                                                                            formHandlingUtils.onChangeHandle(e,formData,setFormData)
                                                                                                            }}></input>
            </label>
            {formData.purchaseDiff === true && 
            <label>
                Why?
                <input id='diffReasoning' type='text' value={formData.diffReasoning} onChange={(e) => formHandlingUtils.onChangeHandle(e,formData,setFormData)}></input>
            </label>
            }
            <label>
                {`Price (£)`}
                <input id='purchasePrice' type='number' min="0.01" step="0.01" value={formData.purchasePrice} onChange={(e) => formHandlingUtils.onChangeHandle(e,formData,setFormData)}></input>
            </label>
            <label>
                Date Purchased
                <input id='purchaseDate' type='date' value={formData.purchaseDate} onChange={(e) => formHandlingUtils.onChangeHandle(e,formData,setFormData)}></input>
            </label>
            <input onClick={handleSubmit} type='submit'></input>
        </form>}
        {eventType === 'payment' &&
        <form className='log-event-form payment'> 
        payment
        </form>}
        {formError && <p>Please fill in all inputs</p>}
        </div>
    </div>
  )
}
