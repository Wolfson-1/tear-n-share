import React, {useEffect, useState, useContext} from 'react';
import {db} from '../../../../../firebase/config';
import { ContextUser } from '../../../../../context/ContextUser';
import { ContextNotification } from '../../../../../context/ContextNotification';
import useFetchDocs from '../../../../../hooks/useFetchDocs';
import useFetchDoc from '../../../../../hooks/useFetchDoc';
import BuddyAdvertsList from '../BuddyAdvertsList';
import BuddyAdvertModal from './BuddyAdvertModal';
import useDeleteDoc from '../../../../../hooks/useDeleteDoc';
import DeleteUserModal from '../delete-modules/DeleteUserModal';
import useUpdateDoc from '../../../../../hooks/useUpdateDoc';

export default function ManageBuddyModal({manageBuddy,setManageBuddy,setMainSelector}) {

    /*Context
    --------------- */
    const user = useContext(ContextUser);
    const notificationsUpdate = useContext(ContextNotification);

    /* State
    -------------*/
    //state to set advert/agreement for BuddyAdvertModal module (for handling management of agreement activity)
    const [manageAd,setManageAd] = useState(null);
    //state for deleting user match onClick
    const [deleteUserModal,setDeleteUserModal] = useState(false);
    const [deleteUserId,setDeleteUserId] = useState(null);
    const [disableMatch,setDisableMatch] = useState(null);
    //state for matched users (who is signed in and who is paired)
    const [sortedUsers,setSortedUsers] = useState(null);

    /* hooks
    ------------ */
    //hook to retreive matched adverts with buddy & current buddy data
    const matchUserInfo = useFetchDoc(db,['sharedUserData'],manageBuddy.id);
    const matchedAdverts = useFetchDocs(db,['sharedUserData',manageBuddy.id,'matchedAdverts'],["createdAt"]);

    //hooks to delete user
    //sharedUserData doc deletion
    const deleteUser = useDeleteDoc(deleteUserId,db,['sharedUserData']);
    //update doc in userData to set active status of user match to false
    const disableUser1 = useUpdateDoc(disableMatch,db,['userData',`${sortedUsers && sortedUsers.loggedIn.userId}`,'activeBuddies',`${sortedUsers && sortedUsers.matchPairId}`]);
    const disableUser2 = useUpdateDoc(disableMatch,db,['userData',`${sortedUsers && sortedUsers.paired.userId}`,'activeBuddies',`${sortedUsers && sortedUsers.matchPairId}`]);

    /*useEffects
    --------------- */
  useEffect(()=>{
    // logic to seperate user specific data for loading to dom (for logged in user & secondary user). only runs ones & wont be overwritted during delete process
    if(matchUserInfo && !sortedUsers){
     setSortedUsers({loggedIn:matchUserInfo.matchedUsers[0].userName === user.displayName ? matchUserInfo.matchedUsers[0] : matchUserInfo.matchedUsers[1],
              paired:matchUserInfo.matchedUsers[0].userName === user.displayName ? matchUserInfo.matchedUsers[1] : matchUserInfo.matchedUsers[0],
              matchPairId:matchUserInfo.id
              })
    }
  },[matchUserInfo]);


    //useEffect to run on completion of disabling userData matched user doc & deletion of sharedUserData .
    useEffect(()=>{
        //once update of userData is completed (to set active to false/not active. set sharedUserData object id to delete)
        if(disableUser1.isComplete === true && disableUser2.isComplete === true) {
            setDeleteUserId([sortedUsers.matchPairId]);
        };

        //when shared user data delete finishes. setManageBuddy to null to close modal out.
        if(deleteUser.isComplete === true) {
             //set Reducer state using context for sending a notification of new message
            notificationsUpdate.updateDispatch( {type:'add-notification',
                payload:{type:'delete-event',
                        userName: sortedUsers.loggedIn.userName,
                        userId: sortedUsers.loggedIn.userId,
                        deleteType:'user'
                        },
                sendId: sortedUsers.paired.userId
            });
            
            setManageBuddy(null)
        };

    },[disableUser1.isComplete,disableUser2.isComplete,deleteUser.isComplete])

    return (
        <div className='modal-background'>
        <div className={manageAd ? 'modal-form-container buddy-container' : 'modal-form-container user-container'}>
            <button className='close-modal' onClick={()=>{setManageBuddy(null)}}>x</button> 
            <div className='user-info'>
                <img alt='profile picture'></img>
                <h1>{manageBuddy.displayName}</h1>
                <button onClick={()=>{setMainSelector('chat')}}>Chat</button>
            </div>
            {!manageAd ? 
            <BuddyAdvertsList matchedAdverts={matchedAdverts} setManageAd={setManageAd} setDeleteUserModal={setDeleteUserModal}/>
            :
            <BuddyAdvertModal matchUserInfo={matchUserInfo} sortedUsers={sortedUsers} advert={manageAd} setManageAd={setManageAd}/>}
            {deleteUserModal && <DeleteUserModal setDisableMatch={setDisableMatch} setDeleteUserModal={setDeleteUserModal}/>}
        </div>
      </div>
  )
}