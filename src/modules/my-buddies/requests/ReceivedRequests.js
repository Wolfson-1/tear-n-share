import React, { useEffect, useState } from 'react'
import {db} from '../../../firebase/config';
import useFetchDocs from '../../../hooks/useFetchDocs';
import useUpdateDoc from '../../../hooks/useUpdateDoc';
import * as timeDateCalcs from '../../../utils/timeDateCalcs';
import useAddSubDoc from '../../../hooks/useAddSubDoc';
import useFetchDoc from '../../../hooks/useFetchDoc';

export default function ReceivedRequests({user,setRequestDelete,setDeletePath}) {

      /* State
    --------------- */

    //request object & id state for updating status of advert requests user side
    const [request,setRequest] = useState(null);
    const [requestId,setRequestId] = useState(null);
    //state for sender id & advert Id to update status of request sender side
    const [senderId,setSenderId] = useState(null);
    const [adId,setAdId] = useState(null)
    //state for adding user & ad data to active buddies
    const [newBuddyUser,setNewBuddyUser] = useState(null);
    const [newBuddyRequester,setNewBuddyRequester] = useState(null);
    // state for userId in dynamic path to add data to requesting user when logged user accepts request 
    const [newBuddyId,setNewBuddyId] = useState(null);

    /* hooks
    --------------- */
    // fetch current received requests
    const receivedRequests = useFetchDocs(db,['userData',user.userUid,'receivedRequests'],["createdAt"]);
    //update requests (logged user & requester side) to accepted or declined. fetch advert ready to add to new buddy
    const updateReceived = useUpdateDoc(request,db,['userData',user.userUid,'receivedRequests',requestId]);
    const updateSent = useUpdateDoc(request,db,['userData',senderId,'sentRequests'],['adId','==',adId]);
    const fetchAdvert = useFetchDoc(db,['userData',user.userUid,'adverts'],adId);
    //addDoc to 'activeBuddies' including ad data from form
    const addBuddyUser = useAddSubDoc(newBuddyUser,fetchAdvert,db,['userData',user.userUid,'activeBuddies'],'matchedAdverts');
    const addBuddyRequester = useAddSubDoc(newBuddyRequester,fetchAdvert,db,['userData',newBuddyId,'activeBuddies'],'matchedAdverts');

    /* useEffects 
    -----------------*/

    //check for when update requests are complete to clear out state ready for next request
    useEffect(() => {
      if(updateReceived.isComplete === true && updateSent.isComplete === true) {
        setRequest(null);
      } 

      if(addBuddyUser.isComplete === true && addBuddyRequester.isComplete === true) {
        setNewBuddyUser(null);
        setNewBuddyRequester(null);

        setAdId(null);
        setSenderId(null);
      }
    },[updateReceived.isComplete,updateSent.isComplete,addBuddyUser.isComplete,addBuddyRequester.isComplete])

    //runs check on change of requests status change. Executes code for buddy setup if accepted & request delete
    useEffect(() => {
      //if logic to run to locate the received request with changed status
      if(receivedRequests) {
        const changeRequest = receivedRequests.find((request)=> {
          return request.status !== 'pending'
        })

        //if a changed request exists, execute code dependant on status then to delete the request for user
        if(changeRequest) {
          console.log('changed request exists');
          //if status change to accepted, set new buddy object for logged in user & requesting user
          if(changeRequest.status === 'accepted') {
            setNewBuddyId(changeRequest.requestUserId)
            setNewBuddyUser([{
              displayName: changeRequest.displayName,
              distance: changeRequest.distance,
              buddysSince: Date.now(),
              requestUserId: changeRequest.requestUserId,
              status:'active'
            }]);
              setNewBuddyRequester([{adId:changeRequest.adId,
              displayName: user.displayName,
              distance: changeRequest.distance,
              buddysSince: Date.now(),
              requestUserId: user.userUid,
              status:'active'
            }]);
          }
          //delete request on status change after addition of new buddy if status was change to accepted
          setDeletePath(['userData',user.userUid,'receivedRequests'])
          setRequestDelete([changeRequest.id]);
        }
      }
    },[receivedRequests])

    //event handler for request update
    const acceptRequest = (accept,request)=> {
      //set path variables to update correct doc
      setRequestId(request.id);
      setSenderId(request.requestUserId);
      setAdId(request.adId);

      //set update doc baed on accept value
      if (accept === true) setRequest({status:'accepted'});
      if (accept === false) setRequest({status:'rejected'});
    };
  
    return (
    <div>
      <p>received requests</p>
      {receivedRequests && receivedRequests.map((request) => {
            //time date calculation for how long past since request made
            const timePassed = timeDateCalcs.lastCheckInSum(request.requestTime,Date.now());

            return <div>
                        <div>
                            <h3>User: {request.displayName}</h3>
                            {timePassed.hoursTotal < 1 && <p> {timePassed.minTotal.toString()} minutes ago</p>}
                            {timePassed.hoursTotal >= 1 && timePassed.hoursTotal < 24 && <p>{timePassed.hoursTotal.toString()} hours ago</p>} 
                            {timePassed.hoursTotal >= 24 && <p>{timePassed.days} days & {timePassed.hoursRemainder} hours ago</p>}
                        </div>
                        {request.status === 'pending' && <div>
                            <button onClick={()=>{acceptRequest(true,request)}}>Accept</button>
                            <button onClick={()=>{acceptRequest(false,request)}}>Decline</button>
                        </div>}
                        {request.status !== 'pending' && <p>{request.status}</p>}
                   </div>
        })}
    </div>
  )
}
