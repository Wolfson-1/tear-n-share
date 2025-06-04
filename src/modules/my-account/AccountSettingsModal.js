import React, { useEffect, useState } from 'react'
import {db} from '../../firebase/config';
import {Icon} from 'react-icons-kit';
import {pencil} from 'react-icons-kit/icomoon/pencil'
import {floppyDisk} from 'react-icons-kit/icomoon/floppyDisk';
import useUpdateDoc from '../../hooks/useUpdateDoc';
import { getAuth, updateProfile, updatePassword } from "firebase/auth";
import ChangePasswordModal from './ChangePasswordModal';

export default function AccountSettingsModal({setSettings, userData}) {

  /* State
  --------------------- */
  //state for userName update
  const [editUser,setEditUser] = useState(false);
  const [newDispName,setNewDispName] = useState(userData.displayName);
  // State to update user name
  const [updateObj,setUpdateObj] = useState(null);
  //form error state
  const [error,setError] = useState(null);
  //state for user unit preference
  const [distUnit,setDistUser] = useState(userData.distanceUnit);
  //change password modal popout state
  const [changePassword,setChangePassword] = useState(false);

  /* Hooks
  --------------------------*/
  //hook to udate user name 
  const updateUser = useUpdateDoc(updateObj,db,['userData',userData.id]);

  /*Event handlers 
  ---------------------------*/
  // event handler to update user name
  const updateUserName = (e) =>{
    e.preventDefault();

    if(!newDispName || newDispName === "") {
        setError('cant set user name as blank');
        return;
    }

    //if no changes in data, set edit to false to close username edit & return
    if (newDispName === userData.displayName) {
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
    //if there is no updateObject but isComplete is still true return
    if(updateObj == null) return;

    if(updateUser.isComplete === true && 'displayName' in updateObj) { //if update complete & updating display name
        setEditUser(false);
        setUpdateObj(null);
    } else if(updateUser.isComplete === true && 'distanceUnit' in updateObj) { //if update complete & updating unit distance
        setUpdateObj(null);
    }
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
                            <form className='username-update'>
                                <input type='text' value={newDispName} onChange={(e) => {
                                                                                setError(null);
                                                                                setNewDispName(e.target.value)}}></input>
                                <Icon onClick={(e)=>{updateUserName(e)}} icon={floppyDisk} size={15}/>
                            </form>
                            :
                            <div className='username-update'>
                                <p>{userData.displayName}</p>
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
                            <input type="checkbox" checked={distUnit === 'M' ? true : false} onClick={()=>{
                                                                                                            setDistUser(distUnit === 'M' ? 'KM' : 'M');
                                                                                                            setUpdateObj({distanceUnit:distUnit === 'M' ? 'KM' : 'M'})}}/>
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
            </div>
        </div>
        {changePassword && <ChangePasswordModal submitPassword={submitPassword} setChangePassword={setChangePassword}/>}
    </div>
  )
}
