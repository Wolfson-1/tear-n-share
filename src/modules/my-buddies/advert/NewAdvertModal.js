import React, { useContext, useEffect, useState } from 'react'
import {db} from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import useAddDoc from '../../../hooks/useAddDoc';
import useFetchDoc from '../../../hooks/useFetchDoc';
import LoafForm from './bread-forms/LoafForm';
import BunBagelForm from './bread-forms/BunBagelForm';
import PastryForm from './bread-forms/PastryForm';
import OtherBreadForm from './bread-forms/OtherBreadForm';
import GeneralFormSliders from './bread-forms/GeneralFormSliders';
import * as formHandlingUtils from '../../../utils/formHandlingUtils';

export default function NewAdvertModal( {closeModal,advertId,setAdvertId,setUpdateData} ) {

    /* State 
    ----------------------------------------*/

    // State for form inputs & form error handling
    const [formData,setFormData] = useState({});
    const [formError,setFormError] = useState(null);

    // State for use in firebase hooks to upload new data based on form
    const [uploadData,setUploadData] = useState(null);

    // context for user info 
    const user = useContext(ContextUser);

    /* Custom firebase hooks 
    ----------------------------------------*/

    // hook for pulling in existing advert data if advertId exists
    const existingAdvertData = useFetchDoc(db,['userData',user.userUid,'adverts',advertId]);

    // hooks for addition of formData to userDatabse
    const uploadNewAd = useAddDoc(uploadData,db,['userData',user.userUid,'adverts']);

    /*useEffects
    --------------------------------------- */

    // Pre load state of initial form data where default values exist
    useEffect (() => {
        if(advertId) {
            setFormData(existingAdvertData);
        } if (existingAdvertData === null) {
            setFormData({...formData,reduced:false,
                breadSplit:50,
                breadFrequency:1,
                breadSpend:0,
                active:true}
                );
        }
    },[existingAdvertData]);

    //useEffect for closing out modal once upload/update/delete of form data is complete
    useEffect(() => {
        if(uploadNewAd.isComplete === true) {
            closeModal(false) 
            setAdvertId(null);
        };
    },[uploadNewAd.isComplete]);

    /* Form handling
    --------------------------------------- */ 

    // form data handle function
    const handleSubmit = (e) => {
        e.preventDefault();
        //init variables for errors & clear state for any previous existing error
        let error = false;
        setFormError(null);
    
        // init array for checking variables are filled
        let fieldsCheckArr = [];

        // loop through form data to load form inputs & input type into fieldsCheckArr
        for (let i = 0; i < e.target.form.length - 1; i++) {
            const inArr = fieldsCheckArr.find(item => {
                return item.name === e.target.form[i].id;
            });
            
            // if logic to ensure no duplicates are added (where multiple options expist for checkboxes)
            if(inArr === undefined) fieldsCheckArr.push({name: e.target.form[i].id, type: e.target.form[i].type});
        };
        
        // check each arr item against form data state to ensure all fields have values
        fieldsCheckArr.forEach((item)=> {
            if(formData[item.name] === undefined){
                error = true
                setFormError('Please fill all fields to create a new advert');
                return;
            };
        });
    
        //if error is true following form check, return
        if(error === true) return;

        // if formError is false after checks, set state of new Advert to be added to database
        advertId ? setUpdateData(formData) : setUploadData([formData]);
    };

  return (
    <div className='modal-background'>
        <div className='modal-form-container new-advert-modal-form-container'>
            <button onClick={() => {
                                    setAdvertId(null)
                                    closeModal(false)
                                    }} className='close-modal'>x</button>
            <h3>Create a New Advert</h3>
            <form className='modal-form'>
                <label>
                    Select Bread Type
                    <select
                        id="breadType"
                        name="breadType"
                        value={formData.breadType}
                        onChange={(e) => formHandlingUtils.onChangeHandle(e,formData,setFormData)}
                    >
                        <option value="" selected disabled hidden>Choose bread type</option>
                        <option value="loaf">Loaf</option>
                        <option value="bunsBagels">Buns {'&'} Bagels</option>
                        <option value="pastry">Pastries</option>
                        <option value='others'>Others</option>
                    </select>
                </label>
                {formData.breadType === 'loaf' ? <LoafForm formData={formData} setFormData={setFormData}/> : null}
                {formData.breadType === 'bunsBagels' ? <BunBagelForm/> : null}
                {formData.breadType === 'pastry' ? <PastryForm/> : null}
                {formData.breadType === 'others' ? <OtherBreadForm/> : null}
                <GeneralFormSliders formData={formData} setFormData={setFormData}/>
                <label>
                    Reduced Hunter
                    <input type='checkbox' id='reduced' name='reduced' checked={formData.reduced} onChange={(e) => formHandlingUtils.onChangeHandle(e,formData,setFormData)}></input>   
                </label>
                <input onClick={handleSubmit} type='submit'></input>
            </form>
            {advertId && <button onClick={()=>{
                                                setUpdateData({active:false});
                                              }}>Discard Advert</button>}
            {formError && <p>{formError}</p>}
        </div>
    </div>
  )
};
