import { useState,useEffect, useReducer } from 'react';
import './css/mainstylesheet.css';
import { ContextUser } from './context/ContextUser';
import { ContextNotification } from './context/ContextNotification';
import notificationReducer from './reducers/notificationReducer';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import authUserCheck from './utils/authUserCheck';

function App() {

  /* State
  -------------------- */

  // State for user Login
  const [user,setUser] = useState({loggedIn:'', displayName:'', userUid:'', email:''});
  //useReducer state for updating infomraiton to uplaod data for notifications.
  const [updateNotification,dispatch] = useReducer(notificationReducer, {updateObj:[],userId:null});

  /* useEffects
  ----------------------*/

  //Auth user check for if user is logged in. if logged in sets state for user
  useEffect(()=> {
    authUserCheck(setUser);
  },[]);

  // wait for user logIn status before render 
  if(user.loggedIn === null) {
    return
  }

  if(user.loggedIn === true && user.displayName) {
    return (
    <>
    <ContextNotification.Provider value={{updateState:updateNotification, updateDispatch: dispatch}}>
      <ContextUser.Provider value={user}>
        {<Home/>}
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
