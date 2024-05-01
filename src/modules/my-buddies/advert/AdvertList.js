import React from 'react'

export default function AdvertList({adverts,setAdvertModal, setExistingAdId}) {

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
                    <button onClick={()=>{editAd(advert.id)}}>{`Info & Edit`}</button>
               </div>
    }))
}
