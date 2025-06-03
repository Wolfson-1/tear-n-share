import React, { useEffect, useState } from 'react'
import {db} from '../../firebase/config';
import useUpdateDoc from '../../hooks/useUpdateDoc';
import { getAuth, updateProfile } from "firebase/auth";

export default function AccountSettingsModal({setSettings, user}) {

  /* State
  --------------------- */
  //state for userName update
  const [editUser,setEditUser] = useState(false);
  const [newDispName,setNewDispName] = useState(user.displayName);
  // State to update user name
  const [updateObj,setUpdateObj] = useState(null);

  /* Hooks
  --------------------------*/
  //hook to udate user name 
  const updateUser = useUpdateDoc(updateObj,db,['userData',user.userUid]);

  const formHandle = (e) =>{
    e.preventDefault();

 

    //if no changes in data, set edit to false to close username edit & return
    if (newDispName === user.displayName) {
        setEditUser(false);
        return;
    };

    const auth = getAuth();
    const userAuth = auth.currentUser;

    console.log(userAuth);
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
                            <form>
                                <input type='text' value={newDispName} onChange={(e) => {setNewDispName(e.target.value)}}></input>
                                <submit onClick={formHandle}>send</submit>
                            </form>
                            :
                            <div>
                                <p>{user.displayName}</p>
                                <button onClick={()=>{setEditUser('userName')}}>edit</button>
                            </div>
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>Password</th>
                        <td>
                            Example password
                            <button>edit</button>
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
                <button>Deactivate Account</button>
            </div>
        </div>
    </div>
  )
}
