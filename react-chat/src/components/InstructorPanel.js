import React, {useState} from "react";
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

  const InstructorPanel = () => {
    const [groupSize, setGroupSize] = useState(5); //Set default groupSize to 5, can be altered by the instructor upon class creation

    const getSetGroupSize = () => { //will return the groupSize value to console, should setGroup size to new value
        setGroupSize(document.getElementById("newSize").value);
        console.log(groupSize);   
    };

  return(
    <div className = "min-vh-100 d-flex align-items-center gradient">
        <Jumbotron className = "Jumbotron">
            <h3 className = "text-center pt-0 pb-0">Group Settings</h3>
            <div className>
                <h5 className = "text-center pt-0 pb-0">Group Size</h5>
            </div>
            <div className>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <input
                    type = "number"
                    className = "text-center mt-1 w-50"
                    min="2"
                    max="10"
                    defaultValue = {groupSize}
                    id = "newSize">
                </input>
            </div>
            &nbsp; &nbsp; &nbsp;
            <div className>
                <button className="mx-auto login btn btn-info" onClick = {getSetGroupSize}>
                    Submit
                </button>
            </div>
        </Jumbotron>
    </div>
  );
};
 export default InstructorPanel;

 
//Currently only needs to inhibit group size, should only be visible to instructor(s)