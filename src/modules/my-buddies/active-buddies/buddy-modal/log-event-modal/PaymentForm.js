import React from 'react'

export default function PaymentForm({unpaid,setUplaodObj,setFormError}) {

    return (
    <form className='log-event-form payment'> 
        {unpaid.map((data)=>{
            return <label>
            <p>Date: £{data.purchaseDate}</p>    
            <p>Price: £{data.purchasePrice}</p>
            <input type='checkbox' checked='false'></input>
            </label>
        })}
    </form>
  )
}
