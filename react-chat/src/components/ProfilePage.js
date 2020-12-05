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
        <div
          style={{
            background: `url(${photoURL || 'https://image.flaticon.com/icons/png/512/194/194938.png'})  no-repeat center center`,
            backgroundSize: "cover",
            height: "75px",
            width: "75px"
          }}
          className="mt-2 mb-0 mx-auto"
        ></div>
        <div className>
        <h4 className = "text-center mt-2 mb-0">{displayName}</h4>
        <small className = "form-text text-muted text-center mt-0">{email}</small>
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
          <small className = "form-text text-muted">Add a little blurb about your interests.</small>
        
          <h6 className = "mb-1 mt-3">Your Major:</h6>
          <select class = "form-control" onChange={(e) => setMajor(e.target.value)} value = {major}>
            <option>Computer Science</option>
            <option>Information Technology</option>
          </select>

          <h6 className = "mb-1 mt-3">Your Strengths:</h6>
          <small className = "form-text text-muted">Pick as many as you'd like.</small>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="software" />
            <label class="form-check-label" for="inlineCheckbox1">Software Dev</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="management" />
            <label class="form-check-label" for="inlineCheckbox2">Project Management</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="writing" />
            <label class="form-check-label" for="inlineCheckbox1">Technical Writing</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="design" />
            <label class="form-check-label" for="inlineCheckbox1">Web Design</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="viz" />
            <label class="form-check-label" for="inlineCheckbox1">Data Viz</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="machinelearning" />
            <label class="form-check-label" for="inlineCheckbox1">Machine Learning</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="leadership" />
            <label class="form-check-label" for="inlineCheckbox1">Leadership</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="webdev" />
            <label class="form-check-label" for="inlineCheckbox1">Web Dev</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="communication" />
            <label class="form-check-label" for="inlineCheckbox1">Communication</label>
          </div>


          <div className = "text-center">
          <button className = "btn btn-primary mt-3" type = "submit">Update</button>
         
          </div>
          <Link to="/" className="text-center mb-0 pb-0" className = "float-left">
            &larr; back to dashboard
          </Link>
          <Link to="/" className="text-center mb-0 pb-0" className = "float-right">
            view as other &rarr;
          </Link>
        </Form>
      </Jumbotron>
    </div>
  );
}

export default ProfilePage;