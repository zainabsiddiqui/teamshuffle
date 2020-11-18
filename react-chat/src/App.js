import React, { useContext } from 'react';
import './App.css';
import { auth } from './Firebase';
import Application from './components/Application';
import Login from './components/Login';
import SignUp from './components/SignUp';
import RoomList from './components/RoomList';
import AddRoom from './components/AddRoom';
import ChatRoom from './components/ChatRoom';
import ProfilePage from './components/ProfilePage';
import UserProvider from "./providers/UserProvider";
import PasswordReset from './components/PasswordReset'
import { UserContext } from "./providers/UserProvider";


function App() {
  return (
     <UserProvider>
        <Application />
      </UserProvider>
  );
}

export default App;