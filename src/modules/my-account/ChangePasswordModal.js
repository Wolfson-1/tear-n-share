import React from 'react'

export default function ChangePasswordModal({setChangePassword,submitPassword}) {
  return (
    <div className='modal-form-container'>
        <button className='close-modal' onClick={()=>{setChangePassword(false)}}>x</button>
        <h2>Please Enter Your New Password</h2>
        <form>
            <label>
                New Password
                <input type='password'></input>
                </label>
            <label>
                Re-enter Password
                <input type='password'></input>
            </label>
            <submit onClick={()=>{submitPassword(e)}}>Set New Password</submit>
        </form>
    </div>
  )
}
