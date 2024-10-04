import React from 'react'

export default function BuddyAdvertModal({advert,setManageAd}) {
  return (
    <>
    <button className='back-button' onClick={()=>{setManageAd(null)}}>Go back</button>
    <div className='advert-info'>
        <p>Bread Type: <span>{advert.breadType}</span></p>
        <p>loaf Type: <span>{advert.loafType}</span></p>
        <p>Split: <span>{advert.breadSplit}%</span></p>
        <p>Spend: <span>£{advert.breadSpend}</span></p>
        <p>Reduced: <span>{advert.reduced ? 'Yes': 'No'}</span></p>
    </div>
    </>
  )
}
