import React, { useState } from 'react'
import FormCheckboxList from '../../../multi-use-modules/FormCheckboxList';

export default function Loafdiv() {

    // arrays for checkbox form inputs
    const storeTypes = ['Sainsburys', 'Asda', 'Tescos','Morrisons','Lidl/Aldi','Co-op','Waitrose/M&S','Convenience Stores','Ind. Bakery',];
    const slicedType = ['unsliced','sliced-any','sliced-thick','sliced-thin'];

    //state for loaf values 
    const [loafType,setLoafType] = useState(null);

return (
    <>
    <label>
        Loaf Type
        <select
            id="loafType"
            selected='null'
            onChange={(e) => {
                setLoafType(e.target.value);
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
