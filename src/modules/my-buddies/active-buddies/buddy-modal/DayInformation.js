import React from 'react'

export default function DayInformation({logged}) {
  return (
    <div className='logged-event'>
    <p>event:</p>
    <p>{logged.type}</p>
    </div>
  )
}
