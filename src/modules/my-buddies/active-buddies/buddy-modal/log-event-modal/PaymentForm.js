import React, { useState } from 'react'

export default function PaymentForm({unpaid,setUpdateObj}) {

    console.log(unpaid);

    /* useState 
    --------------------- */
    //create a new arr with a false boolen value & evenr id for us in form data & tracking of which ones user want to mark as paid
    const [formData,setFormData] = useState(unpaid.unpaidLoggedLogs.map((item)=>{return false}));

    /* onChange for checked
    ----------------------- */ 
    const checked = (index) => {
        //make copy of fomrData to alter
        const newArr = [...formData]
        //logic change 
        if(newArr[index] === true) newArr[index] = false
        if (newArr[index] === false) newArr[index] = true

        setFormData(newArr);
    };

    /* submitHandler 
    -----------------------*/
    const markAsPaid = (e) => {
        e.preventDefault();
        //variable for if checked values exist boolean
        let checkedExists = false;
        //arr to push checked ids if checked = true
        const checkedIdsArr = [];

        //check if any are checked values that user wants to mark as paid.
        formData.forEach(item => {
            if(item === true) checkedExists = true
            return;        
        });

        //if checked exists execute upload of ids to have status changed & what is to be changed 
        if(checkedExists) {
            unpaid.unpaidLoggedLogs.forEach((item,index) =>{
                if(formData[index] === true) checkedIdsArr.push(item.id);
            })
        };

        setUpdateObj({ids:checkedIdsArr,updateData:{paid:true,MarkedPaidTime:Date.now()}});
    };

    return (
    <form className='log-event-form payment'> 
        {unpaid.unpaidLoggedLogs.map((data,index)=>{
            return <label>
            <p>Date: {data.purchaseDate}</p>    
            <p>Price: £{data.purchasePrice}</p>
            <input type='checkbox' checked={formData[index].checked} onChange={()=>{checked(index)}}></input>
            </label>
        })}
        <input type='submit' value='Mark as paid' onClick={markAsPaid}></input>
    </form>
  )
}
