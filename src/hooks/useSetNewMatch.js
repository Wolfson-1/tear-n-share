import { useEffect, useState, useRef, useContext } from 'react';
import {db} from '../firebase/config';
import useAddSubDoc from './useAddSubDoc';
import useFetchDoc from './useFetchDoc';
import useFetchDocs from './useFetchDocs';
import useAddDoc from './useAddDoc';
import useDeleteDoc from './useDeleteDoc';
import { ContextNotification } from '../context/ContextNotification';
import { v4 as uuidv4} from 'uuid';

export default function useSetNewMatch(user,receivedRequests) {

    //context for setting new buddy notificaiton
    const notificationsUpdate = useContext(ContextNotification);

    //customID for buddy & advert objects so these are the same for logged in and requesting user when created 
    const buddyIdRef = useRef(uuidv4());
    const adIdRef = useRef(uuidv4());

    //state for changed request once filtered from array of logged in user requests
    const [changedRequest,setChangedRequest] = useState({});
    //state for buddy ID if buddy pairing already exists & advert data to include in existing buddy pairing
    const [existingBuddy,setExistingBuddy] = useState({adData:[],id:null});
    
    //ref state in order to lock function from trying to process multiple changes at once
    const isProcessingRef = useRef(false);
    //state for triggeringRerun to check for any qued
    const [triggerRerun, setTriggerRerun] = useState(false);

    //state for setting up new buddy match docs (individual refference doc for each user & a shared user data doc)
    const [newBuddy,setNewBuddy] = useState({user:[],requester:[]});
    const [sharedUserObj,setSharedUserObj] = useState(null);

    //state for requests to delete on completion of addition or rejection
    const [deleteObj,setDeleteObj] = useState({request:[],advert:[]});

    /* hooks 
    --------------- */

    //hooks for existing advert linked to request to fetch data when adId state is set. 
    const fetchAdvert = useFetchDoc(db,['userData',user.userUid,'adverts'],changedRequest.adId);
    //fetch existing buddy pairing between logged user and requester if exists
    const currentBuddys = useFetchDocs(db,['userData',user.userUid,'activeBuddies'],["createdAt"]);
    
    //addDoc hooks to create new matched user, if one doesnt already exist, in 'activeBuddies'. 
    const addBuddyUser = useAddDoc(newBuddy.user,db,['userData',user.userUid,'activeBuddies'],buddyIdRef.current);
    const addBuddyRequester = useAddDoc(newBuddy.requester,db,['userData',changedRequest.requestUserId,'activeBuddies'],buddyIdRef.current);

    //Shared data object between users for chat, purchase tracking etc when no existing match currently existing. 
    const addSharedUserData = useAddSubDoc(sharedUserObj,fetchAdvert,db,['sharedUserData'],'matchedAdverts',buddyIdRef.current,adIdRef.current);

    //addDoc to create new advert link for an existing match
    const addAdvertSharedObj = useAddDoc(existingBuddy.adData,db,['sharedUserData',existingBuddy.id,'matchedAdverts'],adIdRef.current);

    //delete hook for removing requests after accept/reject & after user removes
    const deleteRequest = useDeleteDoc(deleteObj.request,db,['userData',user.userUid,'receivedRequests']);
    const deleteAdvert = useDeleteDoc(deleteObj.advert,db,['userData',user.userUid,'adverts']);

    /* useEffects 
    -----------------*/
    //useEffect to check current requests for one that is not pending & action logic based on if it is rejected or accepted
    useEffect(()=>{
        //if processing is currently true or no requests at all. return out of the functiuon
        if (isProcessingRef.current || !receivedRequests) {
        console.log('processing or no requests');
        return;
        }

        //logic to find received request with changed status (when receivedRequests exists)
        if(receivedRequests) {
            const changeRequest = receivedRequests.find((request)=> {
            return request.status !== 'pending'
            })

            //if changed request exists, execute code to access if status is accepted or rejected
            if(changeRequest) {

                //if state is rejected return out of setting match function
                if(changeRequest.status === 'rejected') {
                    setDeleteObj({...deleteObj,request:[changeRequest.id]})
                    return;
                } else if(changeRequest.status === 'accepted') {
                    //if a change requests exists, set to true so this locks function from being run twice on multiple changes
                    isProcessingRef.current = true;
                    console.log('changed request' + changeRequest.requestUserId);
                    //set state for change request for use in hooks
                    setChangedRequest(changeRequest);
                    console.log('changed request exists');
                }
            }
        }
    },[receivedRequests,triggerRerun]);

    //on sucessful retreival of fetchAdvert, run logic to setup new buddy match or + advert to existing match
    useEffect(()=>{
        //check to ensure fetchAdvert exists before proceeding
        if(!fetchAdvert) return;

        console.log(fetchAdvert);
        console.log(currentBuddys);
        console.log(changedRequest);

        //delete id from fetchAdvert as not needed
        delete fetchAdvert['id']

        //if user has existing matches already, filter for match with requesting user
        if(currentBuddys) {
            console.log('current buddy list:' + currentBuddys)
            const existingBuddy = currentBuddys.find(item => {
                return item.matchedUserUid === changedRequest.requestUserId
            })

            // if existing buddy match, add advert to existing pairing
            if(existingBuddy) {
                console.log('existing buddy id' + existingBuddy.id)
                //set data to upload current ad data to existing buddy paring
                setExistingBuddy({id:existingBuddy.id,adData:[fetchAdvert]});
                //return once set to skip rest of new buddy setup as not requred
                return;
            } 
        }; 

        console.log('no existing buddy list or match!')
        const buddySince = Date.now()

        //set objects for upload to create new user buddy pairing
        setNewBuddy({user:[{
                displayName: changedRequest.displayName,
                distance: changedRequest.distance,
                buddySince: buddySince,
                matchedUserUid: changedRequest.requestUserId,
                active:true,
            }],
            requester:[{
                displayName: user.displayName,
                distance: changedRequest.distance,
                buddySince: buddySince,
                matchedUserUid: user.userUid,
                active:true,
        }]});

        setSharedUserObj({
        matchedUsers:[{userName:changedRequest.displayName,userId:changedRequest.requestUserId},
                        {userName:user.displayName,userId:user.userUid}],
        buddySince: buddySince,
        active:true
        });

        //set Reducer state using context for sending a notification of new buddy
        notificationsUpdate.updateDispatch( {type:'add-notification',
        payload:{type:'new-buddy-match',
                userName: user.displayName,
                userId: user.userUid
                },
        sendId: changedRequest.requestUserId
        });
    },[fetchAdvert])

    //check for when update request objects are complete to clear out state ready for next request
    useEffect(() => {  
        // clear state for creating new matched user once completed
        if(addBuddyUser.isComplete === true && addBuddyRequester.isComplete === true && addSharedUserData.isComplete === true) {
            //set delete for advert and request on completion 
            setDeleteObj({advert:[changedRequest.adId],request:[changedRequest.id]});

            //clear variables
            setChangedRequest({});
            setNewBuddy({user:[],requester:[]});
            setSharedUserObj(null);
        }

        // clear state for creating new match for an existing user once completed
        if(addAdvertSharedObj.isComplete === true) {
            //set delete for advert and request on completion 
            setDeleteObj({advert:[changedRequest.adId],request:[changedRequest.id]});

            //clear state
            setChangedRequest({});
            setExistingBuddy({adData:[],id:null});
        };
      },[addBuddyUser.isComplete,addBuddyRequester.isComplete,addAdvertSharedObj.isComplete,addSharedUserData.isComplete])

      //useEffect to run on completion of deletion hooks
      useEffect(()=>{
        //clear delete object state in line with objects removed once deletion of both advert & request is complete
        if(deleteAdvert.isComplete && deleteRequest.isComplete) {
            setDeleteObj({advert:[],request:[]})

            // Reset UUIDs for next match cycle
            buddyIdRef.current = uuidv4();
            adIdRef.current = uuidv4();

            //clear state & unlock function ready for use again
            isProcessingRef.current = false;
            
            //trigger rerun to check for any other requests changed whilst current change request was being processed
            setTriggerRerun(prev => !prev);
        };

        //reset deleteObj state on
        if(deleteAdvert.isComplete && !deleteRequest.isComplete) setDeleteObj({...deleteObj,advert:[]});
      },[deleteRequest.isComplete,deleteAdvert.isComplete]);
};
