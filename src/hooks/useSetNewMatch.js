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

    // key:
    //FORUSERADREFS = code currently not needed that can create array of ids for adverts matched with another user. but in the user pairing obect. unblock for use

    //context for setting new buddy notificaiton
    const notificationsUpdate = useContext(ContextNotification);

    //customID for buddy & advert objects so these are the same for logged in and requesting user when created 
    const buddyIdRef = useRef(uuidv4());
    const adIdRef = useRef(uuidv4());

    /* State
    --------------- */
    //state for changed request once filtered from array of logged in user requests
    const [changedRequest,setChangedRequest] = useState({});
    // state for userId for use in dynamic path to add data to requesting user when logged user accepts request 
    const [requestUserId,setRequestUserId] = useState(null);
    //state for buddy ID if buddy pairing already exists & advert data to include in existing buddy pairing
    const [existingBuddyId,setExistingBuddyId] = useState(null);
    const [adDataExisting,setAdDataExisting] = useState([]);
    
    /* FORUSERADREFS
    const [updateObj,setUpdateObj] = useState(null);
    ------------------------*/

    //state for adding user & ad data to active buddies
    const [newBuddyUser,setNewBuddyUser] = useState(null);
    const [newBuddyRequester,setNewBuddyRequester] = useState(null);
    //state for creating new shared user object 
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
    const addBuddyUser = useAddDoc(newBuddyUser,db,['userData',user.userUid,'activeBuddies'],buddyIdRef.current);
    const addBuddyRequester = useAddDoc(newBuddyRequester,db,['userData',requestUserId,'activeBuddies'],buddyIdRef.current);

    //Shared data object between users for chat, purchase tracking etc when no existing match currently existing. 
    const addSharedUserData = useAddSubDoc(sharedUserObj,fetchAdvert,db,['sharedUserData'],'matchedAdverts',buddyIdRef.current,adIdRef.current);

    /* FORUSERADREFS
    const updateAdvertUser = useUpdateDoc(updateObj,db,['userData',user.userUid,'activeBuddies',existingBuddyId]);
    const updateAdvertRequester = useUpdateDoc(updateObj,db,['userData',requestUserId,'activeBuddies',existingBuddyId]);
    --------------------------------*/

    //addDoc to create new advert link for either an existing match
    const addAdvertSharedObj = useAddDoc(adDataExisting,db,['sharedUserData',existingBuddyId,'matchedAdverts'],adIdRef.current);

    //delete hook for removing requests after accept/reject & after user removes
    const deleteRequest = useDeleteDoc(deleteObj.request,db,['userData',user.userUid,'receivedRequests']);
    const deleteAdvert = useDeleteDoc(deleteObj.advert,db,['userData',user.userUid,'adverts']);

    /* useEffects 
    -----------------*/

    //runs checks on change of a requests status (from pending to accept or reject) then executs code accordingly.
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
                        const existingBuddy = currentBuddys.find(item => {
                            return item.matchedUserUid === changeRequest.requestUserId
                        })
                        
                        console.log('existing buddy' + existingBuddy)

                        // if existing buddy match, add advert to existing pairing
                        if(existingBuddy) {
                            console.log('existing buddy id' + existingBuddy.id)

                            //set existing buddy id variable to complete path for adding ad data to shared user data doc
                            setExistingBuddyId(existingBuddy.id);
                            //set update obj for adding new advert ID for refference for requester & accepter
                           // FORUSERADREFS: setUpdateObj(existingBuddy.matchedAdverts ? {matchedAdverts:[...existingBuddy.matchedAdverts,adIdRef.current]} : {matchedAdverts:[adIdRef.current]});
                        //if no existing buddy or buddys list at all, set new buddy for user and requester
                        } else if (!existingBuddy) {
                            console.log('no existing buddy')

                            const buddySince = Date.now()
                            
                            setNewBuddyUser([{
                                displayName: changeRequest.displayName,
                                distance: changeRequest.distance,
                                buddySince: buddySince,
                                matchedUserUid: changeRequest.requestUserId,
                                active:true,
                               //FORUSERADREFS: matchedAdverts:[adIdRef.current]
                            }]);
                            setNewBuddyRequester([{
                                displayName: user.displayName,
                                distance: changeRequest.distance,
                                buddySince: buddySince,
                                matchedUserUid: user.userUid,
                                active:true,
                              //FORUSERADREFS  matchedAdverts:[adIdRef.current]
                            }]);
                            setSharedUserObj({
                            matchedUsers:[{userName:changeRequest.displayName,userId:changeRequest.requestUserId},
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
                                sendId: changeRequest.requestUserId
                            });
                        }
                    } //if no existing buddys at all, create new & add advert to new
                    else if (!currentBuddys) {
                        console.log('no existing buddy list!')
                        const buddySince = Date.now()
                        
                        setNewBuddyUser([{
                            displayName: changeRequest.displayName,
                            distance: changeRequest.distance,
                            buddySince: buddySince,
                            matchedUserUid: changeRequest.requestUserId,
                            active:true,
                        //FORUSERADREFS    matchedAdverts:[adIdRef.current]
                        }]);
                        setNewBuddyRequester([{
                            displayName: user.displayName,
                            distance: changeRequest.distance,
                            buddySince: buddySince,
                            matchedUserUid: user.userUid,
                            active:true,
                        //FORUSERADREFS    matchedAdverts:[adIdRef.current]
                        }]);
                        setSharedUserObj({
                        matchedUsers:[{userName:changeRequest.displayName,userId:changeRequest.requestUserId},
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
                        sendId: changeRequest.requestUserId
                        });
                    };
                }
            };
        }
    },[receivedRequests]);

    //use Effect to run once fetched advert data is received from back end. 
        useEffect(() => { 
        //remove id property from advert as not needed in copy of data in matched pairings
        if(fetchAdvert) delete fetchAdvert['id']
        // sets data for addition to existing match pairing (know if existing buddy id is set)
        if(fetchAdvert && existingBuddyId) {
            setAdDataExisting([fetchAdvert]);
        };
    },[fetchAdvert])

    //check for when update request objects are complete to clear out state ready for next request
    useEffect(() => {  
        // clear state for creating new matched user once completed
        if(addBuddyUser.isComplete === true && addBuddyRequester.isComplete === true && addSharedUserData.isComplete === true) {
          //set delete for advert and request on completion 
          setDeleteObj({advert:[changedRequest.adId],request:[changedRequest.id]});

        // Reset UUIDs for next match cycle
        buddyIdRef.current = uuidv4();
        adIdRef.current = uuidv4();

          //clear state
          setNewBuddyUser(null);
          setNewBuddyRequester(null);
          setExistingBuddyId(null);
          setSharedUserObj(null);
        }

        // clear state for creating new match for an existing user once completed
        if(addAdvertSharedObj.isComplete === true) {
            //set delete for advert and request on completion 
            setDeleteObj({advert:[changedRequest.adId],request:[changedRequest.id]});


            // Reset UUIDs for next match cycle
            buddyIdRef.current = uuidv4();
            adIdRef.current = uuidv4();

            //clear state
           //FORUSERADREFS setUpdateObj(null);
            setExistingBuddyId(null);
            setAdDataExisting(null);
        };
      },[addBuddyUser.isComplete,addBuddyRequester.isComplete,addAdvertSharedObj.isComplete,addSharedUserData.isComplete])
};
