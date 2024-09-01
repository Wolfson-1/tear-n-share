import React, { useContext } from 'react'
import {ContextUser} from '../../context/ContextUser';
import useFetchDocsFilter from '../../hooks/useFetchDocsFilter';
import { db } from '../../firebase/config';

export default function AdvertListItem({advert,focusProfile,requestEventHandler}) {
 //access user status from context
const user = useContext(ContextUser);

// fetch existing request if one exists
const existingRequest = useFetchDocsFilter(db,['userData',focusProfile.id,'adverts',advert.id,'requests'],'requestUserId',user.userUid);;

 return (
<div className='bread-advert'>
    <div className='key-ad-info'>
        <span>Bread Type: {advert.breadType}</span>
        <span>{advert.loafType}</span>
    </div>
    <div>
        <div className='info-carousel'>
            <span>Max spend: {advert.breadSpend}</span>
            <span>Split: {advert.breadSplit}</span>
        </div>
        {advert.reduced === true ? <span>Reduced</span> : null}
    </div>
    {existingRequest ? <p>Requested</p> : 
    <button onClick={() => {
        requestEventHandler(user,focusProfile,[focusProfile.id,'adverts',advert.id,'requests']);    
        }}>
        Request
    </button>}
</div>
  )
};