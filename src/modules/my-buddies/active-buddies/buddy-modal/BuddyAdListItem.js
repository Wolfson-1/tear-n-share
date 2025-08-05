import React from 'react'

export default function BuddyAdListItem({advert,setManageAd}) {

    return (
    <div className='info-tile bread-advert' key={advert.id}>
        <div className='ad-info'>
            <div className='key-info'>
                <span>Bread Type: {advert.breadType} | {advert.loafType}</span>
            </div>
            <div className='carousel'>
                <span>Max spend: {advert.breadSpend} | Split: {advert.breadSplit} | {advert.reduced === true && "Reduced"}</span>
            </div>
        </div>
        <div className='button-container'>
            <button onClick={()=>{setManageAd(advert)}}>Go to</button>
        </div>
    </div>
    )
};