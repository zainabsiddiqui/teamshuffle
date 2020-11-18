import React, { useContext } from 'react';
import { Router } from "@reach/router";
import Login from './Login';
import SignUp from './SignUp';
import RoomList from './RoomList';
import AddRoom from './AddRoom';
import ChatRoom from './ChatRoom';
import PasswordReset from "./PasswordReset";
import UserProvider from "../providers/UserProvider";
import { UserContext } from "../providers/UserProvider";
import ProfilePage from './ProfilePage';

function Application() {
  const user = useContext(UserContext);

  return (
    user ?
      <Router>
        <RoomList path = "/" />
        <AddRoom path = "addroom" />
        <ProfilePage path = "profilepage" />
        <ChatRoom path = "chatroom/:room" />
      </Router>
      :
        <Router>
          <SignUp path="signup" />
          <Login path="/" />
          <PasswordReset path = "passwordreset" />
        </Router>  
  );
}

export default Application;