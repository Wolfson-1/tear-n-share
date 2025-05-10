import React, { useContext, useEffect, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import {db} from '../../../firebase/config';
import {ContextUser} from '../../../context/ContextUser';
import ActiveBuddyList from './ActiveBuddyList';
import ManageBuddyModal from './buddy-modal/manage-buddy-modal/ManageBuddyModal';
import useFetchDocsFilter from '../../../hooks/useFetchDocsFilter';

export default function ActiveSection({setMainSelector}) {
  // context for user
  const user = useContext(ContextUser);

  /* State
  --------------- */
  const [manageBuddy,setManageBuddy] = useState(null); 

  /* hooks
  --------------- */
  //active buddies data filtered by active users
  const activeBuddys = useFetchDocsFilter(db,['userData',user.userUid,'activeBuddies'],'active',true);

  useEffect(()=>{
    console.log(activeBuddys);
  },[activeBuddys])

  return (
    <div className='buddies-container'>
      <h1>Active Buddys</h1>
      {activeBuddys ? 
        activeBuddys.length > 0 ? <ActiveBuddyList buddys={activeBuddys} setManageBuddy={setManageBuddy} setMainSelector={setMainSelector}/>
        : <h3>Currently no active buddys!</h3>
      :
      <TailSpin wrapperClass='loading-spinner' color="#00BFFF" height={80} width={80}/>}
      {manageBuddy && <ManageBuddyModal manageBuddy={manageBuddy} setManageBuddy={setManageBuddy} setMainSelector={setMainSelector}/>}
    </div>
  )
}
