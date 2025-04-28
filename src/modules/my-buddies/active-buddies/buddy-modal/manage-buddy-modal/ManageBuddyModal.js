import React, {useEffect, useState} from 'react';
import {db} from '../../../../../firebase/config';
import useFetchDocs from '../../../../../hooks/useFetchDocs';
import useFetchDoc from '../../../../../hooks/useFetchDoc';
import BuddyModal from '../BuddyModal';
import BuddyAdvertModal from './BuddyAdvertModal';
import useDeleteDoc from '../../../../../hooks/useDeleteDoc';
import DeleteUserModal from '../delete-modules/DeleteUserModal';
import useUpdateDoc from '../../../../../hooks/useUpdateDoc';

export default function ManageBuddyModal({manageBuddy,setManageBuddy,setMainSelector}) {
    /* State
    -------------*/
    //state to set advert/agreement for BuddyAdvertModal module (for handling management of agreement activity)
    const [manageAd,setManageAd] = useState(null);
    //state for deleting user match onClick
    const [deleteUserModal,setDeleteUserModal] = useState(null);
    const [deleteUserId,setDeleteUserId] = useState(null);
    const [disableMatch,setDisableMatch] = useState(null);
    //state for id's to use in during the delete process if activated.
    const [matchedUserIds,setMatchedUserIds] = useState(null);


    /* hooks
    ------------ */
    //hook to retreive matched adverts with buddy & current buddy data
    const matchUserInfo = useFetchDoc(db,['sharedUserData'],manageBuddy.id);
    const matchedAdverts = useFetchDocs(db,['sharedUserData',manageBuddy.id,'matchedAdverts'],["createdAt"]);

    //hooks to delete user
    //sharedUserData doc deletion
    const deleteUser = useDeleteDoc(deleteUserId,db,['sharedUserData']);
    //update doc in userData to set active status of user match to false
    const disableUser1 = useUpdateDoc(disableMatch,db,['userData',`${matchedUserIds && matchedUserIds.matchedUsers[0].userId}`,'activeBuddies',`${matchedUserIds && matchedUserIds.id}`]);
    const disableUser2 = useUpdateDoc(disableMatch,db,['userData',`${matchedUserIds && matchedUserIds.matchedUsers[1].userId}`,'activeBuddies',`${matchedUserIds && matchedUserIds.id}`]);

    /*useEffects
    --------------- */
    //useEffect to run on completion of disabling userData matched user doc & deletion of sharedUserData .
    useEffect(()=>{
        //once update of userData is completed (to set active to false/not active. set sharedUserData object id to delete)
        if(disableUser1.isComplete === true && disableUser2.isComplete === true) {
            setDeleteUserId([matchUserInfo.id]);
        };

        //when shared user data delete finishes. setManageBuddy to null to close modal out.
        if(deleteUser.isComplete === true) setManageBuddy(null);

    },[disableUser1.isComplete,disableUser2.isComplete,deleteUser.isComplete])

    //make copy of matched user info once fetched so it can still be used during the delete process
    useEffect(()=>{
        if(matchUserInfo && !matchedUserIds) setMatchedUserIds(matchUserInfo);
    },[disableMatch])

    return (
        <div className='modal-background'>
        <div className={manageAd ? 'modal-form-container buddy-container' : 'modal-form-container user-container'}>
            <button className='close-modal' onClick={()=>{setManageBuddy(null)}}>x</button> 
            <div className='user-info'>
                <img alt='profile picture'></img>
                <h1>{manageBuddy.displayName}</h1>
                <button onClick={()=>{setMainSelector('chat')}}>Chat</button>
            </div>
            {matchedAdverts ? <BuddyModal matchedAdverts={matchedAdverts} setManageAd={setManageAd}/>
            :<div>
                <p>You currently have no existing agreements. You will still be able to access your historical chat & message in order to arrange another if so wish. Or until one of you unmatches.</p>
                <button onClick={()=>{setDeleteUserModal({active:false})}}>unmatch</button>
            </div>}
            {manageAd && <BuddyAdvertModal matchUserInfo={matchUserInfo} advert={manageAd} setManageAd={setManageAd}/>}
            {deleteUserModal && <DeleteUserModal setDisableMatch={setDisableMatch} deleteUserModal={deleteUserModal} setDeleteUserModal={setDeleteUserModal}/>}
        </div>
      </div>
  )
}