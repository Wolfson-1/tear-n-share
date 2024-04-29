import React, { useContext, useEffect, useState } from 'react'
import {db} from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import useAddDoc from '../../../hooks/useAddDoc';
import LoafForm from './bread-forms/LoafForm';
import BunBagelForm from './bread-forms/BunBagelForm';
import PastryForm from './bread-forms/PastryForm';
import OtherBreadForm from './bread-forms/OtherBreadForm';
import GeneralFormSliders from './bread-forms/GeneralFormSliders';
import * as formHandlingUtils from '../../../utils/formHandlingUtils';

export default function NewAdvertModal( {closeModal} ) {

    // State for form inputs & form error handling
    const [formData,setFormData] = useState({});
    const [formError,setFormError] = useState({error:false,message:''});
    const [uploadData,setUploadData] = useState('');

    // context for user info 
    // const user = useContext(ContextUser);
    console.log('render');

    // // Pre load state for checkbox values in form that will false by default
    // useEffect (() => {
    //     setFormData({...formData,reduced:false}); 
    // },[]);

    // useAddDoc([uploadData],db,['userData',]);

    // useEffect(() => {
    //     //use effect for closing out modal once Complete is set
    // },[])

    // form data handle function
    const handleSubmit = (e) => {
        e.preventDefault();

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
            return !formData[item.name] ? setFormError({...formError,error: true}) : null
        });

        // if error is true set error message & return
        if (formError === true) {
            setFormError({...formError,message:'Please fill all fields to create a new advert'});
            return;
        };

        // Create new advert by sending to the back end as a new ad.
         // set variable for firebase hook to upload docs
    };

  return (
    <div className='modal-background'>
        <div className='modal-form-container new-advert-modal-form-container'>
            <button onClick={() => {closeModal(false)}} className='close-modal'>x</button>
            <h3>Create a New Advert</h3>
            <form className='modal-form'>
                <label>
                    Select Bread Type
                    <select
                        id="breadType"
                        name="breadType"
                        selected='null'
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
                    <input type='checkbox' id='reduced' name='reduced' onChange={(e) => formHandlingUtils.onChangeHandle(e,formData,setFormData)}></input>   
                </label>
                <input onClick={handleSubmit} type='submit'></input>
            </form>
            {formError && <p>{formError.message}</p>}
        </div>
    </div>
  )
};
