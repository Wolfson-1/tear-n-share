import React, {useEffect, useState} from 'react'
import * as formHandlingUtils from '../../utils/formHandlingUtils';

export default function FormCheckboxList({listArr, valueName, formData, setFormData}) {

    // array for state of checked/unchecked status on state change
    const [checkedState, setCheckedState] = useState(
        new Array(listArr.length).fill(false)
    );

    //useEffect to run if formData exists already to pre-populate this in checkboxes
    useEffect(() => {
      //if form data for valueName exists verify which values where checked & add to checkedState array
      if(formData[valueName]) {
        const updateCheckedState = listArr.map((listItem) => {
          return formData[valueName].find((formItem) => {
            return formItem === listItem
          }) ? true : false
        })
        //update current state for checked values based on formData
        setCheckedState(updateCheckedState);
      };
    },[formData[valueName]]);

    // function to handle state change of each index as checkbox ticked
    const handleOnChange = (position) => {
        // run check through current checked Array & set to true if matching position of checkbox checked
        const updatedCheckedState = checkedState.map((item, index) =>
        index === position ? !item : item
        );

        // new array for checked values based of new checkedState
        const checkedValues = [];
        listArr.forEach((item, index) => 
          updatedCheckedState[index] === true ? checkedValues.push(item) : null
        );

        //set new arrays for checkedState & checked values
        setCheckedState(updatedCheckedState);
        // Update master formData with checkedValues
        formHandlingUtils.addFormData(checkedValues,formData,setFormData,valueName);
    };

    return (
    <>
      <ul className="form-checkbox-list">
        {listArr.map((item, index) => {
          return (
            <li key={index}>
              <div className="list-item">
                <div className="left-section">
                  <label htmlFor={`custom-checkbox-${index}`}>{item}</label>
                  <input
                    type="checkbox"
                    className={`custom-checkbox-${index}`}
                    id={valueName}
                    name={item}
                    value={item}
                    checked={checkedState[index]}
                    onChange={() => handleOnChange(index)}
                  />
                </div>
              </div>
            </li>
          );
        })}
        </ul>
    </>
  )
}
