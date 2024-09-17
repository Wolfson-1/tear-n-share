import { useEffect, useState } from 'react';
import {db} from '../firebase/config';
import useAddSubDoc from './useAddSubDoc';
import useFetchDoc from './useFetchDoc';
import useFetchDocs from './useFetchDocs';
import useAddDoc from './useAddDoc';
import useDeleteDoc from './useDeleteDoc';
import { v4 as uuidv4} from 'uuid';

export default function useSetNewMatch(user,receivedRequests) {

    //customID for buddy & advert objects so these are the same for logged in and requesting user when created 
    const custBuddyId = uuidv4();
    const custAdId = uuidv4();

    /* State
    --------------- */
    //state for changed request once filtered from array of logged in user requests
    const [changedRequest,setChangedRequest] = useState({});
    // state for userId for use in dynamic path to add data to requesting user when logged user accepts request 
    const [requestUserId,setRequestUserId] = useState(null);
    //state for buddy ID if buddy pairing already exists & advert data to include in existing buddy pairing
    const [existingBuddyId,setExistingBuddyId] = useState(null);
    const [adDataExisting,setAdDataExisting] = useState([]);
    //state for adding user & ad data to active buddies
    const [newBuddyUser,setNewBuddyUser] = useState(null);
    const [newBuddyRequester,setNewBuddyRequester] = useState(null);
    //state for requests to delete on completion of addition or rejection
    const [requestDelete,setRequestDelete] = useState(null);
    const [deletePath,setDeletePath] = useState(null);

    /* hooks 
    --------------- */

    //fetch existing advert linked to filtered request when adId state is set 
    const fetchAdvert = useFetchDoc(db,['userData',user.userUid,'adverts'],changedRequest.adId);
    //fetch existing buddy pairing between logged user and requester if exists
    const currentBuddys = useFetchDocs(db,['userData',user.userUid,'activeBuddies'],["createdAt"]);
    //addDoc hooks to create new matched user, if id doesnt already exist, in 'activeBuddies' including matched ad data
    const addBuddyUser = useAddSubDoc(newBuddyUser,fetchAdvert,db,['userData',user.userUid,'activeBuddies'],'matchedAdverts',custBuddyId,custAdId);
    const addBuddyRequester = useAddSubDoc(newBuddyRequester,fetchAdvert,db,['userData',requestUserId,'activeBuddies'],'matchedAdverts',custBuddyId,custAdId);
    //addDocs to create new advert link for an existing maatch
    const addAdvertUser = useAddDoc(adDataExisting,db,['userData',user.userUid,'activeBuddies',existingBuddyId,'matchedAdverts'],custAdId);
    const addAdvertRequester = useAddDoc(adDataExisting,db,['userData',requestUserId,'activeBuddies',existingBuddyId,'matchedAdverts'],custAdId);
    
    //delete hook for removing requests after accept/reject & after user removes
    useDeleteDoc(requestDelete,db,deletePath);

    /* useEffects 
    -----------------*/

    //runs checks on change of a requests status (from pending to accept or reject).
    useEffect(() => {
        //logic to find received request with changed status (when receivedRequests exists)
        if(receivedRequests) {
            const changeRequest = receivedRequests.find((request)=> {
            return request.status !== 'pending'
            })

            //if changed request exists, execute code to access if status is accepted or rejected
            if(changeRequest) {
            //set id for request user state to retreive related requests advert data
            setRequestUserId(changeRequest.requestUserId)
            console.log('changed request' + changeRequest);
            //set state for change request for use in hooks
            setChangedRequest(changeRequest);
            console.log('changed request exists');
            
                //if changed status of request is accepted, check for existing buddy pairing between users
                if(changeRequest.status === 'accepted') {
                    console.log('change request is accept')

                    //if user has existing matches already, filter for match with requesting user
                    if(currentBuddys) {
                        console.log('current buddy list')
                        console.log(currentBuddys)
                        const existingBuddy = currentBuddys.find(async item => {
                            return await item.matchedUserUid === '63VuIAEN8mTBiCgn3Y0PwXzdRhA3'
                        })
                        
                        console.log('existing buddy' + existingBuddy)

                        // if existing buddy match, add advert to existing pairing
                        if(existingBuddy) {
                            console.log('existing buddy id' + existingBuddy.id)

                            //set existing buddy id variable to complete path for adding ad data
                            setExistingBuddyId(existingBuddy.id);
                        //if no existing buddy, set new buddy for user and requester
                        } else if (!existingBuddy) {
                            setNewBuddyUser({
                                displayName: changeRequest.displayName,
                                distance: changeRequest.distance,
                                buddySince: Date.now(),
                                matchedUserUid: changeRequest.requestUserId,
                                status:'active'
                            });
                            setNewBuddyRequester({adId:changeRequest.adId,
                                displayName: user.displayName,
                                distance: changeRequest.distance,
                                buddySince: Date.now(),
                                matchedUserUid: user.userUid,
                                status:'active'
                            });
                        };
                    //if no existing buddys at all, create new & add advert to new
                    } else if (!currentBuddys) {
                        setNewBuddyUser({
                            displayName: changeRequest.displayName,
                            distance: changeRequest.distance,
                            buddySince: Date.now(),
                            matchedUserUid: changeRequest.requestUserId,
                            status:'active'
                        });
                        setNewBuddyRequester({adId:changeRequest.adId,
                            displayName: user.displayName,
                            distance: changeRequest.distance,
                            buddySince: Date.now(),
                            matchedUserUid: user.userUid,
                            status:'active'
                        });
                    }
                }
                setDeletePath(['userData',user.userUid,'receivedRequests'])
                setRequestDelete([changeRequest.id]);
            };
        }
    },[receivedRequests]);

    //use Effect to run once fetched advert data is received from back end. 
        useEffect(() => { 
        //remove id property from advert as not needed in copy of data in matched pairings
        if(fetchAdvert) delete fetchAdvert['id']
        
        // sets data for addition to existing match pairing (know if existing buddy id is set)
        if(fetchAdvert && existingBuddyId) {
            setAdDataExisting([fetchAdvert])
        };
    },[fetchAdvert])

    //check for when update request objects are complete to clear out state ready for next request
    useEffect(() => {  
        // clear state for creating new matched user
        if(addBuddyUser.isComplete === true && addBuddyRequester.isComplete === true) {
          setNewBuddyUser(null);
          setNewBuddyRequester(null);
          setExistingBuddyId(null);
        }

        if(addAdvertUser.isComplete === true && addAdvertRequester.isComplete === true) {
            setExistingBuddyId(null);
        }
      },[addBuddyUser.isComplete,addBuddyRequester.isComplete,addAdvertUser.isComplete,addAdvertRequester.isComplete])
};
