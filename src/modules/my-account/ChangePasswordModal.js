import React, { useState } from 'react'
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import * as formHandlingUtils from '../../utils/formHandlingUtils';

export default function ChangePasswordModal({setChangePassword,submitPassword}) {

    /*State 
    ----------------------------*/
    //state for passowrd values and set visibility
    const [formData,setFormData] = useState({password:'', reEnter:''});
    const [passwordShow,setPasswordShow] = useState({password:false,reEnter:false});
    //error state
    const [error,setError] = useState(null);

  return (
    <div className='modal-form-container'>
        <button className='close-modal' onClick={()=>{setChangePassword(false)}}>x</button>
        <h2>Please Enter Your New Password</h2>
        <form className='modal-form'>
            <label>
                New Password
                <input id='password' type={passwordShow.password ? 'text' : 'password'} value={formData.password} onClick={()=>{setError(null)}} onChange={(e)=>formHandlingUtils.onChangeHandle(e,formData,setFormData)}></input>
                <Icon onClick={() => setPasswordShow(prev => ({ ...prev, password: !prev.password }))} icon={passwordShow.password ? eye : eyeOff} size={25}/>
                </label>
            <label>
                Re-enter Password
                <input id='reEnter' value={formData.reEnter} type={passwordShow.reEnter ? 'text' : 'password'} onClick={()=>{setError(null)}} onChange={(e)=>formHandlingUtils.onChangeHandle(e,formData,setFormData)}></input>
                <Icon onClick={() => setPasswordShow(prev => ({ ...prev, reEnter: !prev.reEnter }))} icon={passwordShow.reEnter ?  eye : eyeOff} size={25}/>
            </label>
            <input type='submit' value='Set New Password' onClick={(e)=>{submitPassword(e,formData,setError,setChangePassword)}}></input>
        </form>
        {error && <p>{error}</p>}
    </div>
  )
}
