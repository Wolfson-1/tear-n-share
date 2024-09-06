import React, { useEffect, useState } from 'react'
import {db} from '../../../firebase/config';
import useFetchDocs from '../../../hooks/useFetchDocs';
import useUpdateDoc from '../../../hooks/useUpdateDoc';
import * as timeDateCalcs from '../../../utils/timeDateCalcs';
import useSetNewMatch from '../../../hooks/useSetNewMatch';

export default function ReceivedRequests({user}) {

      /* State
    --------------- */

    //request object & id state for updating status of advert requests for logged in user
    const [request,setRequest] = useState(null);
    const [requestId,setRequestId] = useState(null);
    //state for sender id & advert Id to update status of requests sender side
    const [senderId,setSenderId] = useState(null);
    const [adId,setAdId] = useState(null)
    //state for adding user & ad data to active buddies

    /* hooks
    --------------- */
    // fetch current received requests
    const receivedRequests = useFetchDocs(db,['userData',user.userUid,'receivedRequests'],["createdAt"]);
    //update request (logged user & requester side) to accepted or declined. fetch advert ready to add to new buddy
    const updateReceived = useUpdateDoc(request,db,['userData',user.userUid,'receivedRequests',requestId]);
    const updateSent = useUpdateDoc(request,db,['userData',senderId,'sentRequests'],['adId','==',adId]);

    //hook to update new buddy match if one doesnt exist, and create new advert match
    const newUserMatch = useSetNewMatch(user,receivedRequests);

    /* useEffects 
    -----------------*/

    //check for when update request objects are complete to clear out state ready for next request if one is made
    useEffect(() => {
      //clear state for request object itself
      if(updateReceived.isComplete === true && updateSent.isComplete === true) {
        setRequest(null);
      };
    },[updateReceived.isComplete,updateSent.isComplete])


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
