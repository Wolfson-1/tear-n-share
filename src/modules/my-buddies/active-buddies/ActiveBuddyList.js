import React from 'react'

export default function ActiveBuddyList({buddys,setManageBuddy}) {
  
    return (
    <div className='active-buddy-list'>
      {buddys.map((buddy) => {
        return <div className='active-buddy'>
                    <div>
                        <h2>{buddy.displayName}</h2>
                        <h3>Distance:{buddy.distance}</h3>
                        <button onClick={()=>setManageBuddy(buddy)}>Manage</button>
                    </div>
                    <img alt={buddy.displayName}></img>
               </div>
      })}
    </div>
  )
}
