import React, { useState } from 'react';
import { Link } from "@reach/router";
import {
    Jumbotron,
    Spinner,
    Form,
    Button,
    FormGroup, 
    Label, 
    Input
} from 'reactstrap';
import firebase from '../Firebase';
import { signInWithGoogle } from '../Firebase';
import { auth } from '../Firebase';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showLoading, setShowLoading] = useState(false);

    const signInWithEmailAndPasswordHandler = (event,email, password) => {
        event.preventDefault();
        setShowLoading(true);
        try {
          auth.signInWithEmailAndPassword(email, password);
        } catch(e) {
          setError("Error signing in with password and email!");
          console.error("Error signing in with password and email", error);
        }
      setShowLoading(false);
    };
      
      const onChangeHandler = (event) => {
          const {name, value} = event.currentTarget;
        
          if(name === 'userEmail') {
              setEmail(value);
          }
          else if(name === 'userPassword'){
            setPassword(value);
          }
      }

    return (
			<div className = "d-flex align-items-center min-vh-100 gradient">
      {showLoading &&
                <Spinner color="primary" />
            }
				<Jumbotron className="Jumbotron pt-4 pb-4">
          <img src="Team_Shuffle_Logo.png" className="logo"/>
          <h1 className = "mt-0 pt-0 text-center"><span className = "badge badge-info">SHUFFLE</span></h1>
          <h4 className = "mt-3 pt-0 text-center">Welcome! Sign in:</h4>
					<form className="">
          <div className = "form-group">
          <label htmlFor="userEmail" className = "mb-0">
            Email
          </label>
          &nbsp; &nbsp;
          <input
            type="email"
            className="form-control"
            name="userEmail"
            value = {email}
            placeholder="E.g: darthvader@gmail.com"
            id="userEmail"
            onChange = {(event) => onChangeHandler(event)}
          />
          <label htmlFor="userPassword" className="mb-0 mt-2">
            Password
          </label>
          &nbsp; &nbsp;
          <input
            type="password"
            className="form-control"
            name="userPassword"
            value = {password}
            placeholder="Your Password"
            id="userPassword"
            onChange = {(event) => onChangeHandler(event)}
          />
          </div>
          <button className="mx-auto login btn btn-info" onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
            Sign in
          </button>
        </form>
        <p className="text-center mt-1 mb-1">or</p>
        <button
          type = "button"
          className="mx-auto login btn btn-info"
          onClick={() => {
            signInWithGoogle();
          }}
        >
          Sign in with Google
        </button>
        <p className="text-center mt-1">
          Don't have an account?{" "}
          <Link to="signup" className="">
            Sign up here
          </Link>{" "}
          <br />{" "}
          <Link to="/passwordreset" className="text-blue-500 hover:text-blue-600">
            Forgot Password?
          </Link>
        </p>
				</Jumbotron>
			</div>
    );
};

export default Login;