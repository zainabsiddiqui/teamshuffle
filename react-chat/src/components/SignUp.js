import React, {useState} from "react";
import { Link, navigate } from "@reach/router";
import { auth, signInWithGoogle, generateUserDocument } from '../Firebase';
import {
  Jumbotron, 
  Spinner,
  Form,
  Button,
  FormGroup,
  Label, 
  Input
} from 'reactstrap';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);

  //setInstructor - used on signup for user to decide if they are an instructor or student; defaulted to false
  const [instructor, setInstructor] = useState(false);
  const [showLoading, setShowLoading] = useState(false);


  // Create user document using Firebase's sign up function AND place details into Firestore
  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();
    setShowLoading(true);

    try{
      const {user} = await auth.createUserWithEmailAndPassword(email, password);

      // Send to Firebase.js to push details into Firestore
      generateUserDocument(user, {displayName, instructor});
      navigate("/");
    } catch(error){
      setError('Error Signing up with email and password');
    }

    setShowLoading(false);
    
    // Clear the fields 
    setEmail("");
    setPassword("");
    setDisplayName("");
    setInstructor(false);
  };

  // Set the email, password, and display name based on what is in the field
  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;

    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    } else if (name === "displayName") {
      setDisplayName(value);
    }
  };

  return (
    <div className = "d-flex align-items-center min-vh-100 gradient">
        <Jumbotron className="Jumbotron pt-4 pb-4">
          <img src="Team_Shuffle_Logo.png" className="logo"/>
          <h1 className = "mt-0 pt-0 text-center"><span className = "badge badge-info">SHUFFLE</span></h1>
          <h4 className = "mt-0 pt-0 text-center">Sign up:</h4>
          {error !== null && (
          <div className="py-4 bg-red-600 w-full text-white text-center mb-3">
            {error}
          </div>
          )}
          <form className="form-group mb-0">
          <div className = "mt-3">
            <label htmlFor="displayName" className = "mb-0">
              Full Name
            </label>
            &nbsp; &nbsp;
            <input
              type="text"
              className="form-control mb-2"
              name="displayName"
              value={displayName}
              placeholder="E.g: Darth Vader"
              id="displayName"
              onChange={event => onChangeHandler(event)}
            />
            <div>
            <label htmlFor="userEmail" className = "mb-0">
              Email
            </label>
            &nbsp; &nbsp;
            <input
              type="email"
              className="form-control mb-2"
              name="userEmail"
              value = {email}
              placeholder="E.g: darthvader@gmail.com"
              id="userEmail"
              onChange = {(event) => onChangeHandler(event)}
            />
            </div>
            </div>
            <label htmlFor="userPassword" className = "mb-0">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="userPassword"
              value = {password}
              placeholder="Your Password"
              id="userPassword"
              onChange = {(event) => onChangeHandler(event)}
            />
            <small id="emailHelp" class="form-text text-muted">Passwords must be greater than six characters long.</small>
            <label className = "mt-2">Are you an instructor?</label>
              <label class="switch float-right">
                <input 
                  name="instructor"
                  type="checkbox"
                  id="instructorInput"
                  checked = {instructor}
                  onChange={() => setInstructor(!instructor)}
                ></input>
                <span class="slider round"></span>
              </label>
              &nbsp; &nbsp;
          <button className="mx-auto login btn btn-info mt-1" onClick = {(event) => createUserWithEmailAndPasswordHandler(event, email, password)}>
            Sign up
          </button>
        </form>
        <p className="text-center mb-1">or</p>
         <button
          onClick={() => {
            try {
              signInWithGoogle();
            } catch (error) {
              console.error("Error signing in with Google", error);
            }
          }}
          className="mx-auto login btn btn-info"
        >
          Sign up with Google
        </button>
        <p className="text-center mt-1">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            Sign in here
          </Link>{" "}
        </p>
        </Jumbotron>
      </div>
  );

      
};

export default SignUp;
