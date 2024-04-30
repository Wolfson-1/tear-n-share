import React from 'react'

export default function AdvertList({adverts}) {

    return (adverts.map(advert => {
        return <div>
                <p>{advert.breadType}</p>
               </div>
    }))
}
