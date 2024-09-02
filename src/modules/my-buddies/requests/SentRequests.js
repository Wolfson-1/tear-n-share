import React from 'react'
import {db} from '../../../firebase/config';
import useFetchDocs from '../../../hooks/useFetchDocs';
import * as timeDateCalcs from '../../../utils/timeDateCalcs';

export default function SentRequests({user}) {

    // hook to fetch current user requests made
    const sentRequests = useFetchDocs(db,['userData',user.userUid,'sentRequests'],["createdAt"]);

  return (
    <div>
        <h2>sent requests</h2>
        {sentRequests && sentRequests.map((request) => {
            //time date calculation for how long past since request made
            const timePassed = timeDateCalcs.lastCheckInSum(request.requestTime,Date.now());

            return <div>
                        <div>
                            <h3>User: {request.displayName}</h3>
                            {timePassed.hoursTotal < 1 && <p> {timePassed.minTotal.toString()} minutes ago</p>}
                            {timePassed.hoursTotal >= 1 && timePassed.hoursTotal < 24 && <p>{timePassed.hoursTotal.toString()} hours ago</p>} 
                            {timePassed.hoursTotal >= 24 && <p>{timePassed.days} days & {timePassed.hoursRemainder} hours ago</p>}
                        </div>
                        <div>
                            <h3>{request.status}</h3>
                            <button>Go to Ad</button>
                            <button>Remove Request</button>
                        </div>
                   </div>
        })}
    </div>
 
)
}
