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
<div className='bread-advert info-tile'>
    <div className='key-ad-info'>
        <span>Bread Type: {advert.breadType}</span>
        <span>{advert.loafType}</span>
    </div>
    <div>
        <div className='info-carousel'>
            <span>Max spend: {advert.breadSpend}</span>
            <span>Split: {advert.breadSplit}</span>
            <span>Max User Distance: {advert.maxDistance}</span>
        </div>
        {advert.reduced === true ? <span>Reduced</span> : null}
    </div>
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
  )
};