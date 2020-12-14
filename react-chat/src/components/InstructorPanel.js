import React, {useState, useContext} from "react";
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

  const InstructorPanel = () => {

    const [groupSize, setGroupSize] = useState(0); //Set default groupSize to 5, can be altered by the instructor upon class creation

    // Push the new group size setting to Firestore
    const pushSize = () => { 
      console.log(groupSize);
        firestore.collection("settings").doc("groupSettings").set({
          groupSize: groupSize
      }); 

    navigate("/");
    };

    const onChangeHandler = event => {
      const { value } = event.currentTarget;

      setGroupSize(value);

  };

  return(
    <div className = "min-vh-100 d-flex align-items-center gradient">
        <Jumbotron className = "Jumbotron">
            <h3 className = "text-center pt-0 pb-2">Group Preferences</h3>
            <div className>
                <h5 className = "text-center pb-0 mb-0">Group Size</h5>
                <small className = "text-muted small-text text-center mt-1 mb-1 d-block">Want to change how many people can be in a group? Set it here:</small>
            </div>
            <div className>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <input
                    type = "number"
                    className = "text-center mt-1 w-50"
                    min="2"
                    max="10"
                    defaultValue = {groupSize}
                    id = "newSize"
                    onChange = {(event) => onChangeHandler(event)}>
                </input>
            </div>
            &nbsp; &nbsp; &nbsp;
            <div className>
                <button className="mx-auto login btn btn-info mb-4" onClick = {() => pushSize()}>
                    Submit
                </button>
            </div>

            <Link to="/" className="text-center mb-0 pb-0">
                        &larr; back to dashboard
                </Link> 
        </Jumbotron>
    </div>
  );
};
 export default InstructorPanel;

 