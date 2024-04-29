import React, { useState } from 'react'
import NewAdvertModal from './NewAdvertModal';

export default function AdvertSection() {

  // state for modal to add a new advert
  const [newAdvert, setNewAdvert] = useState(false);

  // pull data for current adds dependant on user

  return (
    <div className='buddies-container advert'>
      <div className='add-advert'>
        <button onClick={() => {setNewAdvert(true)}}>
          +
        </button>
      </div>
      {newAdvert ? <NewAdvertModal closeModal={setNewAdvert}/> : null}
    </div>
  )
}