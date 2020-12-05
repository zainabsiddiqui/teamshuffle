import React, { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { navigate, Link } from "@reach/router";
import {auth, firestore} from "../Firebase";
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

  const [bio, setBio] = useState('');
  const [major, setMajor] = useState('');
  const [infoUpdated, setInfoUpdated] = useState(false);
  const [error, setError] = useState(null);

   const writeToFirestore = async (e) => {
        e.preventDefault();

        const userRef = firestore.collection('users').doc(user.uid);

        userRef.update({
          bio: bio,
          major: major
        }).then(() => {
          setInfoUpdated(true);
          setTimeout(() => {setInfoUpdated(false)}, 3000);
        })
        .catch(() => {
          setError("There was an error updating the information.");
        });

        // setBio('');
        // navigate("/");  
  }
  

  return (
    <div className = "min-vh-100 d-flex align-items-center gradient">
      <Jumbotron className = "Jumbotron w-50">
        <h3 className = "text-center pt-0 pb-0">Your Profile</h3>
        <small className="form-text text-muted text-center">We know you're awesome. But do they? Add your details below!</small>
        <div
          style={{
            background: `url(${photoURL || 'https://image.flaticon.com/icons/png/512/194/194938.png'})  no-repeat center center`,
            backgroundSize: "cover",
            height: "100px",
            width: "100px"
          }}
          className="mt-3 mb-0 mx-auto"
        ></div>
        <div className>
        <h4 className = "text-center mt-3">{displayName}</h4>
        <small className = "form-text text-muted text-center">{email}</small>
        </div>
        <Form onSubmit = {writeToFirestore}>
          {infoUpdated && (
            <div className = "text-center alert alert-primary mt-2">
              Your info was successfully updated!
            </div>
          )}
          {error !== null && (
            <div className="py-3 bg-red-600 w-full text-white text-center mb-3">
              {error}
            </div>
          )}
          <div class="input-group mt-2">
            <div class="input-group-prepend">
              <span class="input-group-text">Bio</span>
            </div>
            <textarea class="form-control" aria-label="Bio" onChange={(e) => setBio(e.target.value)} value = {bio}></textarea>
          </div>
        
          <h6 className = "mb-0 mt-2">Your Major</h6>
          <select class = "form-control" onChange={(e) => setMajor(e.target.value)} value = {major}>
            <option>Computer Science</option>
            <option>Information Technology</option>
          </select>
          <button className = "btn btn-primary mt-2" type = "submit">Save</button>
        </Form>
      </Jumbotron>
    </div>
  );
}

export default ProfilePage;