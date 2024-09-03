import React, { useEffect, useState } from 'react'
import {db} from '../../../firebase/config';
import useFetchDocs from '../../../hooks/useFetchDocs';
import useUpdateDoc from '../../../hooks/useUpdateDoc';
import * as timeDateCalcs from '../../../utils/timeDateCalcs';

export default function ReceivedRequests({user,setRequestDelete,setDeletePath}) {

      /* State
    --------------- */

    //request object & id state for updating status of advert requests user side
    const [request,setRequest] = useState(null);
    const [requestId,setRequestId] = useState(null);
    //state for sender id & advert Id to update status of request sender side
    const [senderId,setSenderId] = useState(null);
    const [adId,setAdId] = useState(null)

    /* hooks
    --------------- */
    // fetch current received requests
    const receivedRequests = useFetchDocs(db,['userData',user.userUid,'receivedRequests'],["createdAt"]);
    //update requests (logged user & requester side) to accepted or declined
    const updateReceived = useUpdateDoc(request,db,['userData',user.userUid,'receivedRequests',requestId]);
    const updateSent = useUpdateDoc(request,db,['userData',senderId,'sentRequests'],['adId','==',adId]);

    /* useEffects 
    -----------------*/

    //check for when update requests are complete to clear out state ready for next request
    useEffect(() => {
      if(updateReceived.isComplete === true && updateSent.isComplete === true) {
        setRequest(null);
      } 
    },[updateReceived.isComplete,updateSent.isComplete])

    useEffect(() => {
      //if logic to run forEach only when receivedRequsts are pulled through
      if(receivedRequests) {
        const toDelete = receivedRequests.find((request)=> {
          return request.status !== 'pending'
        })

        //if toDelete exists set path & object in order to delete
        if(toDelete) {
          setDeletePath(['userData',user.userUid,'receivedRequests'])
          setRequestDelete([toDelete.id]);
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
