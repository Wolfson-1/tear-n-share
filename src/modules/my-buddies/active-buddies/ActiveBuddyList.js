import React from 'react'

export default function ActiveBuddyList({buddys,setManageBuddy,setMainSelector}) {
  
    return (
    <>
      {buddys.map((buddy) => {
        return <div className='info-tile active-buddy' key={buddy.id}>
                    <div className='user-info'>
                        <h2>{buddy.displayName}</h2>
                        <hr></hr>
                        <h3>Distance:{buddy.distance}</h3>
                      <div>
                          <button onClick={()=>setManageBuddy(buddy)}>Manage</button>
                          <span>|</span>
                          <button onClick={()=>{setMainSelector('chat')}}>Chat</button>
                        </div>
                    </div>
                    <picture className='profile-img'>
                      <img src={'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png'} alt={buddy.displayName}></img>
                    </picture>
               </div>
      })}
    </>
  )
}
