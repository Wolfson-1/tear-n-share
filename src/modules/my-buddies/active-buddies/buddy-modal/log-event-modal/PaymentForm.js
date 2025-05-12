import React, { useState } from 'react'

export default function PaymentForm({sortedEvents,setUpdateObj}) {

    /* useState 
    --------------------- */
    //create a new arr with a false boolen value & evenr id for us in form data & tracking of which ones user want to mark as paid
    const [formData,setFormData] = useState(sortedEvents ? sortedEvents.unpaidLoggedLogs.map(()=>{return false}): null);
    //state for total value of those checked as paid
    const [checkedTotal,setCheckedTotal] = useState(0);

    /* onChange for checked
    ----------------------- */ 
    const checked = (index) => {
        //make copy of fomrData to alter
        const newArr = [...formData]
        //logic change
        if(newArr[index] === true) {
            newArr[index] = false
            setCheckedTotal(checkedTotal - Number(sortedEvents.unpaidLoggedLogs[index].costRatio.pairedUser))
        } else if (newArr[index] === false) {
            newArr[index] = true
            setCheckedTotal(checkedTotal + Number(sortedEvents.unpaidLoggedLogs[index].costRatio.pairedUser))
        }
        
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
            sortedEvents.unpaidLoggedLogs.forEach((item,index) =>{
                if(formData[index] === true) checkedIdsArr.push(item.id);
            })
        };

        setUpdateObj({ids:checkedIdsArr,updateData:{paid:true,MarkedPaidTime:Date.now()},totalPaid:checkedTotal});
    };

    return (
    <>
    {sortedEvents ? <form className='log-event-form payment'> 
        {sortedEvents.unpaidLoggedLogs.length > 0 && <p>Total Marked As Paid:£{checkedTotal}</p>}
        {sortedEvents.unpaidLoggedLogs.length > 0 ? sortedEvents.unpaidLoggedLogs.map((data,index)=>{
            return <label key={data.id}>
            <p>Date: {data.purchaseDate}</p>    
            <p>Price: £{data.purchasePrice}</p>
            <p>You Owe: £{data.costRatio.pairedUser}</p>
            <input type='checkbox' checked={formData[index].checked} onChange={()=>{checked(index)}}></input>
            </label>
        }) : 
        <p>you are all paid up!</p>}
        <input type='submit' value='Mark as paid' onClick={markAsPaid}></input>
    </form> : 
    <div>No purchases or payments logged, yet..</div>}
    </>
  )
}
