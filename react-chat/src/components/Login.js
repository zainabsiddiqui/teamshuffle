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
          setShowLoading(false);
        } catch(e) {
          setError("Error signing in with password and email!");
          console.error("Error signing in with password and email", error);
        }
        // auth.signInWithEmailAndPassword(email, password).catch(error => {
        // setError("Error signing in with password and email!");
        //   console.error("Error signing in with password and email", error);
        // });
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

	// const history = useHistory();
 //    const [creds, setCreds] = useState({ nickname: '' });
 //    const [showLoading, setShowLoading] = useState(false);
 //    const ref = firebase.database().ref('users/');
    
 //    const onChange = (e) => {
 //        e.persist();
 //        setCreds({...creds, [e.target.name]: e.target.value});
 //    }
    
 //    const login = (e) => {
 //        e.preventDefault();
 //        setShowLoading(true);
 //        ref.orderByChild('nickname').equalTo(creds.nickname).once('value', snapshot => {
 //            if (snapshot.exists()) {
 //                localStorage.setItem('nickname', creds.nickname);
 //                history.push('/roomlist');
 //                setShowLoading(false);
 //            } else {
 //                const newUser = firebase.database().ref('users/').push();
 //                newUser.set(creds);
 //                localStorage.setItem('nickname', creds.nickname);
 //                history.push('/roomlist');
 //                setShowLoading(false);
 //            }
 //        });
 //    };
    
    return (
			<div className = "d-flex align-items-center min-vh-100 gradient">
      {showLoading &&
          <Spinner color="primary" />
        }
				<Jumbotron className="Jumbotron pt-4 pb-4">
          <img src="Team_Shuffle_Logo.png" className="logo"/>
          <h2 className = "mt-0 pt-0 text-center bold">SHUFFLE</h2>
          <h4 className = "mt-0 pt-0 text-center">Welcome! Sign in:</h4>
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