import React, { useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import { navigate, Link } from "@reach/router";
import {auth} from "../Firebase";
import {
    Alert,
    Jumbotron,
    Spinner,
    Form,
    Button,
    FormGroup, 
    Label, 
    Input
} from 'reactstrap';

const ProfilePage = () => {

  const user = useContext(UserContext);
  const {photoURL, displayName, email} = user;
  

  return (
    <div className = "min-vh-100 d-flex align-items-center gradient">
      <Jumbotron className = "Jumbotron">
        <h3 className = "text-center pt-0 pb-0">Your Profile</h3>
        <div
          style={{
            background: `url(${photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'})  no-repeat center center`,
            backgroundSize: "cover",
            height: "200px",
            width: "200px"
          }}
          className="mt-3 mb-0 mx-auto"
        ></div>
        <div className>
        <h4 className = "text-center mt-3">{displayName}</h4>
        <h5 className = "text-center">{email}&nbsp;•&nbsp;<Link to = "passwordreset">UPDATE</Link></h5>
        </div>
      </Jumbotron>
    </div>
  );
}

export default ProfilePage;