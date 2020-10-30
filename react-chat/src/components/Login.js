import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
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


function Login() {
    const history = useHistory();
    const [creds, setCreds] = useState({ nickname: '' });
    const [showLoading, setShowLoading] = useState(false);
    const ref = firebase.database().ref('users/');
    
    const onChange = (e) => {
        e.persist();
        setCreds({...creds, [e.target.name]: e.target.value});
    }
    
    const login = (e) => {
        e.preventDefault();
        setShowLoading(true);
        ref.orderByChild('nickname').equalTo(creds.nickname).once('value', snapshot => {
            if (snapshot.exists()) {
                localStorage.setItem('nickname', creds.nickname);
                history.push('/roomlist');
                setShowLoading(false);
            } else {
                const newUser = firebase.database().ref('users/').push();
                newUser.set(creds);
                localStorage.setItem('nickname', creds.nickname);
                history.push('/roomlist');
                setShowLoading(false);
            }
        });
    };
    
    return (
        <div>
            {showLoading &&
                <Spinner color="primary" />
            }
			
            <Jumbotron className="Jumbotron">
                <Form className="LoginForm" onSubmit={login}>
                    <FormGroup>
                        <Label>Name</Label>
                        <Input className="input" type="text" name="nickname" id="nickname" placeholder="Enter Your Name" value={creds.nickname} onChange={onChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Password</Label>
                        <Input className="input" type="password" name="password" id="password" placeholder="Enter Your Password" onChange={onChange} />
                    </FormGroup>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
            </Jumbotron>
        </div>
    );
}

export default Login;