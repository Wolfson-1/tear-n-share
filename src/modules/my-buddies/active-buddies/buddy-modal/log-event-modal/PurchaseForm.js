import React,{useEffect,useState} from 'react'
import * as formHandlingUtils from '../../../../../utils/formHandlingUtils';

export default function PurchaseForm({ user,setUploadObj,setFormError}) {

    /* State
    ----------------------*/
    // State for form inputs & form error handling
    const [formData,setFormData] = useState({eventDate:'',purchaseDiff:false, purchasePrice:''});


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

      /* Form handling
    -----------------------*/
    const handleSubmit = (e) =>{
        e.preventDefault();
        //init local variable for errors & clear error state for any previous existing error
        let submitError = false;
        setFormError(null);

        // loop through form data to load form inputs & input type into fieldsCheckArr
        for (let i = 0; i < e.target.form.length - 1; i++) {
            // if logic to ensure no duplicates are added (where multiple options exist for checkboxes)
            if(formData[e.target.form[i].id] === undefined || formData[e.target.form[i].id] === null || formData[e.target.form[i].id] === '') {
                submitError = true
            }
        };

        //If error is true, set formError for display in dom and return.
        if(submitError === true) {
            setFormError(true);
            return;
        }

        //set formData for upload including user data for who logged event
        setUploadObj([{
                    eventType:'purchase',
                    eventUser:user.displayName, 
                    eventUserId:user.userUid,
                    paid:false,
                     ...formData}]);
    };


  return (
    <form className='log-event-form purchase'>
        <label>
            Purchase different from advert specifications?
            <input id='purchaseDiff' type='checkbox' checked={formData.purchaseDiff} onChange={(e) => {
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
            <input id='eventDate' type='date' value={formData.eventDate} onChange={(e) => formHandlingUtils.onChangeHandle(e,formData,setFormData)}></input>
        </label>
        <input onClick={handleSubmit} type='submit'></input>
    </form>
  )
}
