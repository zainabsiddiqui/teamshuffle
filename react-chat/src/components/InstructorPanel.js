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

    // var settingsRef = firestore.collection("settings").doc("groupSettings");
    // settingsRef.get().then(function(doc) {
    //   if (doc.exists) {
    //       setGroupSize(doc.data().groupSize);
    //   } else {
    //       // doc.data() will be undefined in this case
    //       console.log("No such document!");
    //   }
    // }).catch(function(error) {
    //     console.log("Error getting document:", error);
    // });


    const pushSize = () => { //will return the groupSize value to console, should setGroup size to new value
      console.log(groupSize);
        firestore.collection("settings").doc("groupSettings").set({
          groupSize: groupSize
      }); 
    };

    const onChangeHandler = event => {
      const { value } = event.currentTarget;

      setGroupSize(value);
      // console.log(groupSize);
      // console.log(defaultValue);

  };

  // console.log(document.getElementById("newSize"));



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
                    id = "newSize"
                    onChange = {(event) => onChangeHandler(event)}>
                </input>
            </div>
            &nbsp; &nbsp; &nbsp;
            <div className>
                <button className="mx-auto login btn btn-info" onClick = {() => pushSize()}>
                    Submit
                </button>
            </div>
        </Jumbotron>
    </div>
  );
};
 export default InstructorPanel;

 