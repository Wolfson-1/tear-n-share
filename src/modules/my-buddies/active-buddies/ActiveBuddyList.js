import React from 'react'

export default function ActiveBuddyList({buddys,setManageBuddy,setMainSelector}) {
  
    return (
    <div className='active-buddy-list'>
      {buddys.map((buddy) => {
        return <div className='active-buddy'>
                    <div>
                        <h2>{buddy.displayName}</h2>
                        <h3>Distance:{buddy.distance}</h3>
                        <div>
                          <button onClick={()=>setManageBuddy(buddy)}>Manage</button>
                          <button onClick={()=>{setMainSelector('chat')}}>Chat</button>
                        </div>
                    </div>
                    <img alt={buddy.displayName}></img>
               </div>
      })}
    </div>
  )
}
