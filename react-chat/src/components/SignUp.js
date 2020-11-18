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

  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();
    try{
      console.log("welp we got here i guess")
      const {user} = await auth.createUserWithEmailAndPassword(email, password);
      console.log("wtf we logged in")
      generateUserDocument(user, {displayName});
      navigate("/");
    }
    catch(error){
      setError('Error Signing up with email and password');
      console.log("Error code: " + error);
    }
      
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

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
          <h2 className = "mt-0 pt-0 text-center bold">SHUFFLE</h2>
          <h4 className = "mt-0 pt-0 text-center">Sign Up</h4>
          {error !== null && (
          <div className="py-4 bg-red-600 w-full text-white text-center mb-3">
            {error}
          </div>
          )}
          <form className="">
          <div className = "text-center mt-3">
            <div>
            <label htmlFor="displayName" className="block">
              Name:
            </label>
            &nbsp; &nbsp;
            <input
              type="text"
              className="mt-1 w-50"
              name="displayName"
              value={displayName}
              placeholder="E.g: Darth Vader"
              id="displayName"
              onChange={event => onChangeHandler(event)}
            />
            </div>
            <div>
            <label htmlFor="userEmail">
              Email:
            </label>
            &nbsp; &nbsp;
            <input
              type="email"
              className="mt-1 w-50"
              name="userEmail"
              value = {email}
              placeholder="E.g: darthvader@gmail.com"
              id="userEmail"
              onChange = {(event) => onChangeHandler(event)}
            />
            </div>
            </div>
            <div className = "text-center mr-5 mb-3">
            <label htmlFor="userPassword" className="block">
              Password:
            </label>
            &nbsp; &nbsp;
            <input
              type="password"
              className="mt-1 w-50"
              name="userPassword"
              value = {password}
              placeholder="Your Password"
              id="userPassword"
              onChange = {(event) => onChangeHandler(event)}
            />
          </div>
          <button className="mx-auto login btn btn-info" onClick = {(event) => createUserWithEmailAndPasswordHandler(event, email, password)}>
            Sign up
          </button>
        </form>
        <p className="text-center mt-1 mb-1">or</p>
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
