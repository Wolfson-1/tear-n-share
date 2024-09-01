import React from 'react'
import {db} from '../../../firebase/config';
import useFetchDocs from '../../../hooks/useFetchDocs';

export default function SentRequests({user}) {

    // hook to fetch current user requests made
    const sentRequests = useFetchDocs(db,['userData',user.userUid,'requests'],["createdAt"]);

  return (
    <div>
        <h2>sent requests</h2>
        {sentRequests && sentRequests.map(() => {
            return <p>request item</p>
        })}
    </div>
 
)
}
