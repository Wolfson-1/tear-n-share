import React from 'react'

export default function AdvertList({adverts, setAdvertModal, setExistingAdId, activeStatus, setUpdateData}) {

    //function to update active staus of advert via the reactivate button
    const activateAd = (id) => {
        setExistingAdId(id);
        setUpdateData({active:true});
    };

    //function to repoen modal with loaded ad data. passes down existing Id to do this
    const editAd = (id) => {
        setExistingAdId(id);
        setAdvertModal(true);
    };

    return (adverts.map(advert => {
        return <div className='bread-advert active'>
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
                    {activeStatus === true && <button onClick={()=>{editAd(advert.id)}}>{`Info & Edit`}</button>}
                    {activeStatus === false && <button onClick={()=>{activateAd(advert.id)}}>Re-Activate</button>}
               </div>
    }))
}
