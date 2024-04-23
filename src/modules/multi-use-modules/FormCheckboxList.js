import React, {useState} from 'react'

export default function FormCheckboxList({listArr}) {

    // array for state of checked/unchecked status on state change
    const [checkedState, setCheckedState] = useState(
        new Array(listArr.length).fill(false)
    );

    // function to handle state change of each index as checkbox ticked
    const handleOnChange = (position) => {
        // run check through current checked Array & set to true if matching position of checkbox checked
        const updatedCheckedState = checkedState.map((item, index) =>
        index === position ? !item : item
        );
        //set new modified array to checkedState
        setCheckedState(updatedCheckedState);
    }

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
