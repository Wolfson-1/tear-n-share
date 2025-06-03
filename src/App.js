import { useState, useReducer } from 'react';
import './css/mainstylesheet.css';
import { db } from './firebase/config';
import { ContextUser } from './context/ContextUser';
import { ContextNotification } from './context/ContextNotification';
import notificationReducer from './reducers/notificationReducer';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import useAuthUserCheck from './hooks/useAuthUserCheck';
import useFetchDoc from './hooks/useFetchDoc';

function App() {

  /* State
  -------------------- */

  // State for user Login
  const [user,setUser] = useState({loggedIn:'', displayName:'', userUid:'', email:''});
  //useReducer state for updating infomraiton to uplaod data for notifications.
  const [updateNotification,dispatch] = useReducer(notificationReducer, {updateObj:[],userId:null});

  /* Hooks
  ----------------------*/
  //fetch userData
  const userData = useFetchDoc(db,['userData'],user.userUid);

  // listener to set user data on login & on updates made by logged user
  useAuthUserCheck(userData && userData.displayName,setUser);

  // wait for user logIn status before render 
  if(user.loggedIn === null) {
    return
  }

  if(user.loggedIn === true && user.displayName) {
    return (
    <>
    <ContextNotification.Provider value={{updateState:updateNotification, updateDispatch: dispatch}}>
      <ContextUser.Provider value={user}>
        {<Home userData={userData}/>}
      </ContextUser.Provider>
    </ContextNotification.Provider>
    </>
    );
  } else if (user.loggedIn === false) {
    return (
    <LoginPage setUser={setUser}/>
    )
  }  
};

export default App;
