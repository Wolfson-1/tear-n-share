import React, { useContext } from 'react'
import {ContextUser} from '../../context/ContextUser';
import useFetchDocsFilter from '../../hooks/useFetchDocsFilter';
import { db } from '../../firebase/config';

export default function AdvertListItem({advert,focusProfile,requestEventHandler}) {
 //access user status from context
const user = useContext(ContextUser);

// fetch existing request if request already sent
const existingRequest = useFetchDocsFilter(db,['userData',user.userUid,'sentRequests'],'adId',advert.id);

 return (
<div className='info-tile bread-advert'>
    <div className='ad-info'>
        <div className='key-info'>
            <span>Bread Type: {advert.breadType} | {advert.loafType}</span>
        </div>
        <div className='carousel'>
            <span>Max spend: {advert.breadSpend} | Split: {advert.breadSplit} | Max User Distance: {advert.maxDistance} | {advert.reduced === true && "Reduced"}</span>
        </div>
    </div>
    <div className='button-container'>
    {existingRequest && existingRequest.length > 0 ?
        <>
            {existingRequest[0].status === 'pending' && <p>Requested</p>}
            {existingRequest[0].status === 'rejected' && <p>Rejected</p>}
        </> 
        : 
        <>
        {focusProfile.distToUser < advert.maxDistance ? 
            <button onClick={() => {
                requestEventHandler(user,focusProfile,advert,[focusProfile.id,'receivedRequests']);
                }}>
                Request
            </button>
        : <p>Max distance to user exceeded for this advert.</p>}
        </>
    }
    </div>
</div>
  )
};