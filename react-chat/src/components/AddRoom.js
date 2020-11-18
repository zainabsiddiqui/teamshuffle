import React, { useContext, useState} from "react";
import { UserContext } from "../providers/UserProvider";
import { Link, navigate } from "@reach/router";
import {auth} from "../Firebase";
import { firestore } from '../Firebase';
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
import firebase from '../Firebase';

const AddRoom = () => {
    const [formValue, setFormValue] = useState('');

    const writeToFirestore = async (e) => {
        e.preventDefault();

        const roomsRef = firestore.collection('rooms');

        await roomsRef.add({
          roomname: formValue,
          idea: "Nothing to see here (yet!)"
        })

        console.log(formValue);

        setFormValue('');
        navigate("/");
    
  }

    return (
        <div className = "min-vh-100 d-flex align-items-center gradient">
          
            <Jumbotron className = "Jumbotron">
                <h4>Get creative!</h4>
                <h2>Enter your new group name:</h2>
                <Form onSubmit = {writeToFirestore}>
                    <FormGroup>
                        <Label>Group Name</Label>
                        <Input type="text" name="roomname" id="roomname" onChange={(e) => setFormValue(e.target.value)} placeholder="E.g. The Dark Side" value={formValue} />
                    </FormGroup>
                    <Button type="submit" disabled = {!formValue} className = "btn btn-primary">
                        Add
                    </Button>
                </Form>
            </Jumbotron>
        </div>
    );
}

export default AddRoom;