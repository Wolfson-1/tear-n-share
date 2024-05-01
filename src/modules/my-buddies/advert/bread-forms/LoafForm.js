import React, { useState } from 'react'
import FormCheckboxList from '../../../multi-use-modules/FormCheckboxList';
import * as formHandlingUtils from '../../../../utils/formHandlingUtils';

export default function Loafdiv({formData,setFormData}) {

    // multiple check box value arrays
    const storeTypes = ['Sainsburys', 'Asda', 'Tescos','Morrisons','Lidl/Aldi','Co-op','Waitrose/M&S','Convenience Stores','Ind. Bakery'];
    const slicedType = ['unsliced','sliced-any','sliced-thick','sliced-thin'];

return (
    <>
    <label>
        Loaf Type
        <select
            id="loafType"
            selected='null'
            value={formData.loafType}
            onChange={(e) => {
               formHandlingUtils.onChangeHandle(e,formData,setFormData);
            }}
        >
            <option value="" selected disabled hidden>Choose loaf type</option>
            <option value='White'>White</option>
            <option value='Wholemeal'>Brown/Wholemeal</option>
            <option value='seeded'>Seeded</option>
            <option value='farmhouse'>Farmhouse</option>
            <option value='50/50'>50/50</option>
            <option value='sourdough'>Sourdough</option>
            <option value='glutenFree'>Gluten Free</option>
        </select>
    </label>
      <p>Stores:</p>
      <FormCheckboxList listArr = {storeTypes} valueName={'stores'} formData = {formData} setFormData={setFormData}/>
      <p>Sliced:</p>
      <FormCheckboxList listArr = {slicedType} valueName={'sliced'} formData = {formData} setFormData={setFormData}/>
    </>
)
}
