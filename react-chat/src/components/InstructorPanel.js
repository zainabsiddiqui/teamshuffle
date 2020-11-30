import React, {useState} from "react";
import { Link, navigate } from "@reach/router";
import {
    Jumbotron, 
    Spinner,
    Form,
    Button,
    FormGroup,
    Label, 
    Input
  } from 'reactstrap';

  const InstructorPanel = () => {

  var groupSize = 5; //Set default groupSize to 5, can be altered by the instructor upon class creation

  return(
      <div>
          <Jumbotron className="Jumbotron pt-4 pb-4">
              <h2 className="mt-0 pt-0 text-center bold">Group Settings</h2>
            <div>
                <label htmlFor="groupSize" className="block">
                Max Group Size:
                </label>
                &nbsp; &nbsp;
                <input
                    type="number"
                    className="mt-1 w-50"
                    name="groupSize"
                    value={groupSize}
                    id="groupSize"
                    //onChange={event => onChangeHandler(event)}
                />
            </div>
              
          </Jumbotron>
      </div>
  );
};
 export default InstructorPanel;

 
//Currently only needs to inhibit group size, should only be visible to instructor(s)