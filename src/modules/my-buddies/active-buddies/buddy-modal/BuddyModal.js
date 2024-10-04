import React from 'react'
import BuddyAdListItem from './BuddyAdListItem';

export default function BuddyModal({matchedAdverts,manageBuddy,setManageAd}) {
  return (
    <>
        <img alt='profile picture'></img>
        <h1>{manageBuddy.displayName}</h1>     
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
