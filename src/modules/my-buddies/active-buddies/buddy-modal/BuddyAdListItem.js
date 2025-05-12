import React from 'react'

export default function BuddyAdListItem({advert,setManageAd}) {

    return (
    <div className='info-tile advert'>
        <div className='key-ad-info' key={advert.id}>
            <div>
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
        </div>
        <button onClick={()=>{setManageAd(advert)}}>Go to</button>
    </div>
    )
    };