import React, { useState, useContext } from "react";
import { auth } from "../Firebase";
import { UserContext } from "../providers/UserProvider";
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

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);

  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;

    if (name === "userEmail") {
      setEmail(value);
    }
  };

  // Uses Firebase functions to send reset email
  const sendResetEmail = event => {
    event.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
          setEmailHasBeenSent(true);
        setTimeout(() => {setEmailHasBeenSent(false)}, 3000);
      })
      .catch(() => {
        setError("Error resetting password");
      });
  };
  return (
    <div className="d-flex align-items-center min-vh-100 gradient">
      <Jumbotron className="Jumbotron pt-4 pb-4">
      <img src="Team_Shuffle_Logo.png" className="logo"/>
      <h2 className = "mt-0 pt-0 text-center bold">SHUFFLE</h2>
      <h4 className="mt-0 pt-0 text-center">
        Reset password:
      </h4>
      <div className="mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
        <form action="">
          {emailHasBeenSent && (
            <div className = "text-center alert alert-primary">
              An email has been sent to you!
            </div>
          )}
          {error !== null && (
            <div className="py-3 bg-red-600 w-full text-white text-center mb-3">
              {error}
            </div>
          )}
          <div className = "form-group">
          <label htmlFor="userEmail" className="w-full block mb-0">
            Email
          </label>
          &nbsp;&nbsp;
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            value={email}
            placeholder="Input your email"
            onChange={onChangeHandler}
            className="form-control"
          />
          </div>
          <button
            className="mx-auto login btn btn-info mt-3 mb-3"
            onClick={event => {
              sendResetEmail(event);
            }}
          >
            Send me a reset link
          </button>
        </form>

        <Link
          to="/"
          className="my-2 text-blue-700 hover:text-blue-800 text-center block"
        >
          &larr; take me back to sign in
        </Link>
      </div>
      </Jumbotron>
    </div>
  );
};

export default PasswordReset;