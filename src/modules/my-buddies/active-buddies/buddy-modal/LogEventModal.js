import React, {useEffect, useState} from 'react'
import * as formHandlingUtils from '../../../../utils/formHandlingUtils';

export default function LogEventModal({eventType,setLogEvent}) {

    /* State
    ----------------------*/
    // State for form inputs & form error handling
    const [formData,setFormData] = useState({});
    const [formError,setFormError] = useState(null);

    // State for use in firebase hooks to upload new data based on form
    const [uploadData,setUploadData] = useState(null);


    /* Form handling
    -----------------------*/
    const handleSubmit = (e) =>{
        e.preventDefault();
    };

    useEffect(()=>{
        console.log(formData)
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
                Price
                <input id='purchasePrice' type='text' value={formData.purchasePrice} onChange={(e) => formHandlingUtils.onChangeHandle(e,formData,setFormData)}></input>
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
        </div>
    </div>
  )
}
