import React, { useContext, useState } from 'react';
import {db} from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import useFetchDocs from '../../../hooks/useFetchDocs';
import ActiveBuddyList from './ActiveBuddyList';
import ManageBuddyModal from './buddy-modal/ManageBuddyModal';

export default function ActiveSection({setMainSelector}) {
  // context for user
  const user = useContext(ContextUser);

  /* State
  --------------- */
  const [manageBuddy,setManageBuddy] = useState(null); 

  /* hooks
  --------------- */
  //active buddies data
  const activeBuddys = useFetchDocs(db,['userData',user.userUid,'activeBuddies'],["createdAt"]);

  return (
    <div className='buddies-container'>
      <h1>Active Buddys</h1>
      {activeBuddys ? <ActiveBuddyList buddys={activeBuddys} setManageBuddy={setManageBuddy} setMainSelector={setMainSelector}/> : <h3>Currently no active buddys!</h3>}
      {manageBuddy && <ManageBuddyModal manageBuddy={manageBuddy} setManageBuddy={setManageBuddy} setMainSelector={setMainSelector}/>}
    </div>
  )
}
