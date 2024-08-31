import { useState,useEffect } from 'react';
import './css/mainstylesheet.css';
import {ContextUser} from './context/ContextUser';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import authUserCheck from './utils/authUserCheck';

function App() {
  // State for user Login
  const [user,setUser] = useState({loggedIn:'', displayName:'', userUid:'', email:''});

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
      <ContextUser.Provider value={user}>
        {<Home/>}
      </ContextUser.Provider>
    </>      
    );
  } else if (user.loggedIn === false) {
    return (
    <LoginPage setUser={setUser}/>
    )
  }  
};

export default App;
