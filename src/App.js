import { useState,useEffect } from 'react';
import './css/mainstylesheet.css';
import {ContextUser} from './context/ContextUser';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import authUserCheck from './utils/authUserCheck';

function App() {
  // State for user Login
  const [user,setUser] = useState({loggedIn:false, user:'', email:''});

  //Auth user check for if user is logged in. if logged in sets state for user
  useEffect(()=> {
    authUserCheck(setUser);
  },[]);

  // 
  if(user.loggedIn === true) {
    return (
    <>
      <ContextUser.Provider value={user}>
        <Home/>
      </ContextUser.Provider>
    </>      
    );
  } else if (user.loggedIn === false) {
    return (
    <LoginPage user={user} setUser={setUser}/>
    )
  }  
}

export default App;
