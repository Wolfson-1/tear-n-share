import React from 'react'
import { TailSpin } from 'react-loader-spinner';
import BuddyAdListItem from './BuddyAdListItem';

export default function BuddyAdvertsList({matchedAdverts,setManageAd,setDeleteUserModal}) {

  return (
    <>    
        {matchedAdverts ? 
          <div className='advert-section'>
                {matchedAdverts.length > 0 ? matchedAdverts.map((advert)=>{
                    return <BuddyAdListItem advert={advert} setManageAd={setManageAd}/>
                  })
                  :
                  <>
                    <p>You currently have no existing agreements. You will still be able to access your historical chat & message in order to arrange another if so wish. Or until one of you unmatches.</p>
                    <button onClick={()=>{setDeleteUserModal(true)}}>unmatch</button>
                  </>
                  }
            </div>
          :
          <TailSpin wrapperClass='loading-spinner' color="#00BFFF" height={80} width={80}/>}
    </>
  )
}
