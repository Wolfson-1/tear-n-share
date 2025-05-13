import React, { useEffect, useState } from 'react'
import { TailSpin } from 'react-loader-spinner';
import {db} from '../../../firebase/config';
import useFetchDocs from '../../../hooks/useFetchDocs';
import * as timeDateCalcs from '../../../utils/timeDateCalcs';

export default function SentRequests({user}) {

    /* useState 
    --------------- */
    const [active,setActive] = useState(null);
    const [historical,setHistorical] = useState(null);

    /* hooks
    --------------- */
    // fetch current user requests made
    const sentRequests = useFetchDocs(db,['userData',user.userUid,'sentRequests'],["createdAt"]);

    /* useEffect 
    ----------------*/

    //filter sentRequests into active and historical requests once retreived from backend
    useEffect(()=>{
        if(sentRequests) {
            const active = sentRequests.filter((request)=>{
                return request.status == 'pending'
            })
            
            const historical = sentRequests.filter((request)=>{
                return request.status !== 'pending'
            })
            
            console.log(active);
            console.log(historical);

            //set state for filtered historical &
            setHistorical(historical)
            setActive(active)
        };
    },[sentRequests])


  return (
    <>
    {active && historical ? <div className='sent-requests'>
        <div className='sent active'>
            <h2>active requests</h2>
            {active && active.map((request) => {
                //time date calculation for how long past since request made
                const timePassed = timeDateCalcs.lastCheckInSum(request.requestTime,Date.now());

                return <div className='info-tile sent-request' key={request.id}>
                            <div>
                                <h3>User: {request.displayName}</h3>
                                <p>{request.basicAdInfo}</p>
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
        <div className='sent historical'>
            <h2>Historical Requests</h2>
        {historical && historical.map((request) => {
                //time date calculation for how long past since request made
                const timePassed = timeDateCalcs.lastCheckInSum(request.requestTime,Date.now());

                return <div className='info-tile sent-request-historical'>
                            <div>
                                <h3>User: {request.displayName}</h3>
                                <p>{request.basicAdInfo}</p>
                                {timePassed.hoursTotal < 1 && <p> {timePassed.minTotal.toString()} minutes ago</p>}
                                {timePassed.hoursTotal >= 1 && timePassed.hoursTotal < 24 && <p>{timePassed.hoursTotal.toString()} hours ago</p>} 
                                {timePassed.hoursTotal >= 24 && <p>{timePassed.days} days & {timePassed.hoursRemainder} hours ago</p>}
                            </div>
                            <div>
                                <h3>{request.status}</h3>
                            </div>
                        </div>
            })}
        </div>
    </div>
    :
    <TailSpin wrapperClass='loading-spinner' color="#00BFFF" height={80} width={80}/>}
    </>
)
}
