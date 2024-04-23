import React, { useState } from 'react'
import LoafForm from './bread-forms/LoafForm';
import BunBagelForm from './bread-forms/BunBagelForm';
import PastryForm from './bread-forms/PastryForm';
import OtherBreadForm from './bread-forms/OtherBreadForm';
import GeneralFormSliders from './bread-forms/GeneralFormSliders';

export default function NewAdvertModal( {closeModal} ) {

    // state for bread form inputs select
    const [breadType,setBreadType] = useState('');

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
                        selected='null'
                        onChange={(e) => {
                        setBreadType(e.target.value);
                        }}
                    >
                        <option value="" selected disabled hidden>Choose bread type</option>
                        <option value="loaf">Loaf</option>
                        <option value="bunsBagels">Buns {'&'} Bagels</option>
                        <option value="pastry">Pastries</option>
                        <option value='others'>Others</option>
                    </select>
                </label>
                {breadType === 'loaf' ? <LoafForm/> : null}
                {breadType === 'bunsBagels' ? <BunBagelForm/> : null}
                {breadType === 'pastry' ? <PastryForm/> : null}
                {breadType === 'others' ? <OtherBreadForm/> : null}
                <GeneralFormSliders/>
                <label>
                    Reduced Hunter
                    <input type='checkbox'></input>   
                </label>
                <input type='submit'></input>
            </form>
        </div>
    </div>
  )
}
