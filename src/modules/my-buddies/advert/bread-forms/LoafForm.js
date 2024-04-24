import React, { useState } from 'react'
import FormCheckboxList from '../../../multi-use-modules/FormCheckboxList';

export default function Loafdiv({setBreadSpecific}) {

    // multiple check box value arrays
    const storeTypes = ['Sainsburys', 'Asda', 'Tescos','Morrisons','Lidl/Aldi','Co-op','Waitrose/M&S','Convenience Stores','Ind. Bakery'];
    const slicedType = ['unsliced','sliced-any','sliced-thick','sliced-thin'];

    //state for loaf values 
    const [formData,setFormData] = useState({loafType:'White',storeTypes:['morrisons','Asda','Aldi/Lidl'],slicedType:['unsliced','sliced-any']});

    // what i need this obkect to look like
    const exampObject = {loafType:'White',storeTypes:['morrisons','Asda','Aldi/Lidl'],slicedType:['unsliced','sliced-any']};

    //formhandle to update object containing form data
    const formhandle = (e,object,setObject,keyValue) => {
        setObject({...object,[keyValue]: e.target.value});
        console.log(object);
    };


return (
    <>
    <label>
        Loaf Type
        <select
            id="loafType"
            selected='null'
            onChange={(e) => {
               // setLoafType(e.target.value);
               formhandle(e,formData,setFormData,'loafType');
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
      <FormCheckboxList listArr = {storeTypes}/>
      <p>Sliced:</p>
      <FormCheckboxList listArr = {slicedType}/>
    </>
)
}
