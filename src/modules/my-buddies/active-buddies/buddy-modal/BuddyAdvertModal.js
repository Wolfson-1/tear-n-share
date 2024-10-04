import React from 'react'

export default function BuddyAdvertModal({advert,setManageAd}) {
  return (
    <>
    <button onClick={()=>{setManageAd(null)}}>Back to buddy page</button>
    <p>{advert.loafType}</p>
    </>
  )
}
