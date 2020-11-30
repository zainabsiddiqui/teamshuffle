import React, { useContext } from 'react';
import { Router } from "@reach/router";
import Login from './Login';
import SignUp from './SignUp';
import RoomList from './RoomList';
import AddRoom from './AddRoom';
import ChatRoom from './ChatRoom';
import PasswordReset from "./PasswordReset";
import InstructorPanel from "./InstructorPanel";
import UserProvider from "../providers/UserProvider";
import { UserContext } from "../providers/UserProvider";
import ProfilePage from './ProfilePage';

function Application() {
  const user = useContext(UserContext);
  var role;
  user ?
  {role} = user 
  :
  console.log("User is null");
  return (
    // Check if user is authenticated
     user ?
      // Check whether current user is an instructor
      role == "Instructor" ?
        // Specific instructor-only routes
        <Router>
        <RoomList path = "/" />
        <AddRoom path = "addroom" />
        <ProfilePage path = "profilepage" />
        <ChatRoom path = "chatroom/:room" />
        <InstructorPanel path = "groupSettings"/>
      </Router>
      :
      // User is not instructor, so regular authenticated user routes
        <Router>
          <RoomList path = "/" />
          <AddRoom path = "addroom" />
          <ProfilePage path = "profilepage" />
          <ChatRoom path = "chatroom/:room" />
        </Router>
        :
        // User is not even authenticated, so only non-authenticated routes
          <Router>
            <SignUp path="signup" />
            <Login path="/" />
            <PasswordReset path = "passwordreset" />
          </Router>  
    );
}

export default Application;