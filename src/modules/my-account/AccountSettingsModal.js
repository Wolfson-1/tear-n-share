import React, { useEffect, useState } from 'react'
import {db} from '../../firebase/config';
import useUpdateDoc from '../../hooks/useUpdateDoc';
import { getAuth, updateProfile, updatePassword } from "firebase/auth";
import ChangePasswordModal from './ChangePasswordModal';
import {Icon} from 'react-icons-kit';
import {pencil} from 'react-icons-kit/icomoon/pencil'
import {floppyDisk} from 'react-icons-kit/icomoon/floppyDisk'

export default function AccountSettingsModal({setSettings, user}) {

  /* State
  --------------------- */
  //state for userName update
  const [editUser,setEditUser] = useState(false);
  const [newDispName,setNewDispName] = useState(user.displayName);
  // State to update user name
  const [updateObj,setUpdateObj] = useState(null);
  //form error state
  const [error,setError] = useState(null);
  //change password modal popout state
  const [changePassword,setChangePassword] = useState(false);

  /* Hooks
  --------------------------*/
  //hook to udate user name 
  const updateUser = useUpdateDoc(updateObj,db,['userData',user.userUid]);

  const updateUserName = (e) =>{
    e.preventDefault();

    if(!newDispName || newDispName === "") {
        setError('cant set user name as blank');
        return;
    }

    //if no changes in data, set edit to false to close username edit & return
    if (newDispName === user.displayName) {
        setEditUser(false);
        return;
    };

    const auth = getAuth();
    const userAuth = auth.currentUser;

    //update auth user status 
    updateProfile(userAuth, {
        displayName: newDispName,
      }).then(() => {
        console.log("User profile updated.");
      }).catch((error) => {
        console.error("Error updating user profile:", error);
      });

    //set update object to update user display name
    setUpdateObj({displayName:newDispName});
  };

  //form handle function to change/update password
  const submitPassword = (e,formData,setError,setModal) =>{
    e.preventDefault();
    
    console.log(formData);
    // form input error handling
    if(formData.password === '' || formData.reEnter === '') {
        setError('please fill in both fields')
        return;
    } else if(formData.password !== formData.reEnter) {
        setError('password does not match!')
        return;
    };
    
    //get auth and current user
    const auth = getAuth();
    const userAuth = auth.currentUser;

    //update user password if form value checks pass
    updatePassword(userAuth, formData.password).then(() => {
        console.log('password update sucess!');
        setModal(false);
    }).catch((error) => {
        //set error state
        setError('there was an error in updating your password. Please try again later');
        //log error to console
        console.log(error);
    });
    
  };

  /* useEffects
  ------------------------ */
  //useEffect to run when updating user name is complete to switch back from edit mode
  useEffect(()=>{
    if(updateUser.isComplete === true) setEditUser(false)
  },[updateUser.isComplete]);

  return (
    <div className='modal-background'>
        <div className='modal-form-container'>
            <button onClick={() => {
            setSettings(false)
            }} className='close-modal'>x</button>
            <div className='settings-container'>
                <h2>Profile Settings</h2>
                <table>
                    <tr>
                        <th>User Name</th>
                        <td>
                            {editUser ?  
                            <form className='modal-form'>
                                <input type='text' value={newDispName} onChange={(e) => {
                                                                                setError(null);
                                                                                setNewDispName(e.target.value)}}></input>
                                <Icon onClick={(e)=>{updateUserName(e)}} icon={floppyDisk} size={15}/>
                            </form>
                            :
                            <div>
                                <p>{user.displayName}</p>
                                <Icon onClick={()=>{setEditUser('userName')}} icon={pencil} size={15}/>
                            </div>
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>Password</th>
                        <td>
                            <button onClick={()=>{setChangePassword(true)}}>Change Password</button>
                        </td>
                    </tr>
                    <tr>
                        <th>Distance Units</th>
                        <td>
                        <label class="slider-toggle">
                            <input type="checkbox" />
                            <div class="labels">
                                <span class="label-on">KM</span>
                                <span class="label-off">M</span>
                            </div>
                            <div class="slider-icon"></div>
                        </label>
                        </td>
                    </tr>
                </table>
                {error && <p>{error}</p>}
                <button>Deactivate Account</button>
            </div>
        </div>
        {changePassword && <ChangePasswordModal submitPassword={submitPassword} setChangePassword={setChangePassword}/>}
    </div>
  )
}
