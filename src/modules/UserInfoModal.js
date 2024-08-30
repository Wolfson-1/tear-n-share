import React from 'react'
import { db } from '../firebase/config';
import useFetchDocsFilter from '../hooks/useFetchDocsFilter'

export default function UserInfoModal({user,setUser}) {

  //hook to fetch active advert data
  const adverts = useFetchDocsFilter(db,['userData',user.id,'adverts'],'active',true);


  return (
    <div className='modal-background'>
      <div className='modal-form-container'>
        <button className={'close-modal'} onClick={()=>{setUser(null)}}>x</button>
        <img alt='profile picture'></img>
        <h1>{user.displayName}</h1>
        <h3>Distance: {Math.round(user.distToUser * 100) / 100}</h3>

        <p>Adverts</p>
        {adverts && <div>
            {adverts.map((advert)=> {
                return <div className='bread-advert'>
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
                <button>Request</button>
           </div>
            })}   
        </div>}
      </div>
    </div>
  )
}
