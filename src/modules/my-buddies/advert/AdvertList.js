import React from 'react'

export default function AdvertList({adverts,activeStatus,toggleAd,editAd}) {

    return (adverts.map(advert => {
        return <div className='bread-advert active'>
                    <div className='info-container'>
                        <div className='key-ad-info'>
                            <span>Bread Type: {advert.breadType}</span>
                            <span> | </span>
                            <span>{advert.loafType}</span>
                        </div>
                        <div>
                            <div className='info-carousel'>
                                <span>Max spend: £{advert.breadSpend}</span>
                                <span> | </span>
                                <span>Split: {advert.breadSplit}%</span>
                            </div>
                            {advert.reduced === true ? <span>Reduced: True</span> : <span>Reduced: False</span>}
                        </div>
                    </div>
                    <div className='button-container'>
                        {activeStatus === true && <button onClick={()=>{editAd(advert.id)}}>{`Info & Edit`}</button>}
                        {activeStatus === true && <button onClick={()=>{toggleAd(advert.id,false)}}>Deactivate</button>}
                        {activeStatus === false && <button onClick={()=>{toggleAd(advert.id,true)}}>ReActivate</button>}
                    </div>
               </div>
    }))
};