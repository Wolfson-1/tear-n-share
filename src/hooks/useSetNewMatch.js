import { useEffect, useState } from 'react';
import {db} from '../firebase/config';
import useAddSubDoc from './useAddSubDoc';
import useFetchDoc from './useFetchDoc';
import useFetchDocs from './useFetchDocs';
import useAddDoc from './useAddDoc';
import useDeleteDoc from './useDeleteDoc';
import { v4 as uuidv4} from 'uuid';

export default function useSetNewMatch(user,receivedRequests) {

    //customID for buddy & advert obkects: 
    const custBuddyId = uuidv4();
    const custAdId = uuidv4();

    /* State
    --------------- */
    //state for changed request
    const [changedRequest,setChangedRequest] = useState({});
    // state for userId in dynamic path to add data to requesting user when logged user accepts request 
    const [requestUserId,setRequestUserId] = useState(null);
    //state for buddy ID if buddy pairing already exists & advert data to include in existing buddy pairing .
    const [existingBuddyId,setExistingBuddyId] = useState(null);
    const [adDataExisting,setAdDataExisting] = useState([]);
    //state for adding user & ad data to active buddies
    const [newBuddyUser,setNewBuddyUser] = useState(null);
    const [newBuddyRequester,setNewBuddyRequester] = useState(null);
    const [isComplete,setIsComplete] = useState(false);
    //state for deleted requests
    const [requestDelete,setRequestDelete] = useState(null);
    const [deletePath,setDeletePath] = useState(null);

    /* hooks 
    --------------- */

    //fetch existing advert
    const fetchAdvert = useFetchDoc(db,['userData',user.userUid,'adverts'],changedRequest.adId);
    //fetch existing buddy pairing if it exists
    const currentBuddys = useFetchDocs(db,['userData',user.userUid,'activeBuddies'],["createdAt"]);
    //addDoc to create new matched user in 'activeBuddies' including matched ad data if a request is accepted
    const addBuddyUser = useAddSubDoc(newBuddyUser,fetchAdvert,db,['userData',user.userUid,'activeBuddies'],'matchedAdverts',custBuddyId,custAdId);
    const addBuddyRequester = useAddSubDoc(newBuddyRequester,fetchAdvert,db,['userData',requestUserId,'activeBuddies'],'matchedAdverts',custBuddyId,custAdId);
    //addDoc to create new advert for existing maatch
    const addAdvertUser = useAddDoc(adDataExisting,db,['userData',user.userUid,'activeBuddies',existingBuddyId,'matchedAdverts'],custAdId);
    const addAdvertRequester = useAddDoc(adDataExisting,db,['userData',requestUserId,'activeBuddies',existingBuddyId,'matchedAdverts'],custAdId);
    
    //delete hook for removing requests after accept/reject & after user removes
    useDeleteDoc(requestDelete,db,deletePath);


    /* useEffects 
    -----------------*/

    //runs check on change of requests status change. Executes code for buddy setup if accepted & request delete
    useEffect(() => {

        console.log(custBuddyId);
        console.log(custAdId);
        //if logic to run to locate the received request with changed status when receivedRequests exist
        if(receivedRequests) {
            console.log(receivedRequests);
            console.log('fetch advert:' + fetchAdvert);
            console.log(newBuddyUser);
            console.log(newBuddyRequester)
            console.log(existingBuddyId);

            const changeRequest = receivedRequests.find((request)=> {
            return request.status !== 'pending'
            })

            //if a changed request exists, execute code dependant on accept/reject status
            if(changeRequest) {
            //set id for request user for use in db path for adding advert requester side
            setRequestUserId(changeRequest.requestUserId)
            console.log('changed request' + changeRequest);
            //set state for change request for use in hooks
            setChangedRequest(changeRequest);
            console.log('changed request exists');
            
                //if status of request changed to accepted, check for existing buddy pairing. If doesnt exist, create new.
                if(changeRequest.status === 'accepted') {
                    // if currentBuddys exist, run check for if user sending request is already an existing match
                    console.log('change request is accept')

                    //if user has existing matches already, filter for match with requesting user
                    if(currentBuddys) {
                        console.log('current buddy list')
                        console.log(currentBuddys);
                        const existingBuddy = currentBuddys.find(async item => {
                            return await item.matchedUserUid === '63VuIAEN8mTBiCgn3Y0PwXzdRhA3'
                        })
                        
                        console.log('existing budd' + existingBuddy)

                        // if existing buddy match, add advert to existing
                        if(existingBuddy) {
                            console.log('existing buddy' + existingBuddy.id)

                            //set existing buddy id variable to complete path for adding ad data
                            setExistingBuddyId(existingBuddy.id);
                        };
                    };

                    //if no existing buddys, or a buddy pair, create new & add advert to new
                    if (!currentBuddys) {
                        setNewBuddyUser([{
                            displayName: changeRequest.displayName,
                            distance: changeRequest.distance,
                            buddySince: Date.now(),
                            matchedUserUid: changeRequest.requestUserId,
                            status:'active'
                        }]);
                        setNewBuddyRequester([{adId:changeRequest.adId,
                            displayName: user.displayName,
                            distance: changeRequest.distance,
                            buddySince: Date.now(),
                            matchedUserUid: user.userUid,
                            status:'active'
                        }]);
                    };
                }
                setDeletePath(['userData',user.userUid,'receivedRequests'])
                setRequestDelete([changeRequest.id]);
            };
        }
    },[receivedRequests]);

    useEffect(() => { 
        if(fetchAdvert && existingBuddyId) setAdDataExisting([fetchAdvert]);
    },[fetchAdvert])

    //check for when update request objects are complete to clear out state ready for next request if one is made
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

    return isComplete;
};
