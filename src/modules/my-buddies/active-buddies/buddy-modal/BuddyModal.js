import React from 'react'
import BuddyAdListItem from './BuddyAdListItem';

export default function BuddyModal({matchedAdverts,manageBuddy,setManageAd}) {
  return (
    <>    
        <div className='advert-section'>
            <h3>Adverts</h3>
            <div className='advert-list-container'>
                {<div className='advert-list'>
                {matchedAdverts && matchedAdverts.map((advert)=>{
                    return <BuddyAdListItem advert={advert} setManageAd={setManageAd}/>
                })}
                </div>}
            </div>
        </div>
    </>
  )
}
