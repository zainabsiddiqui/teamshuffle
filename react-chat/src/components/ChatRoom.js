import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../providers/UserProvider";
import { navigate, Link, useParams } from "@reach/router";
import {auth, getRoomDocuments} from "../Firebase";
import firebase from '../Firebase';
import { firestore } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import '../Styles.css';
import {
    Container, 
    Row, 
    Col,
    Card,
    CardBody,
    CardSubtitle,
    Button,
    Form,
    InputGroup,
    Input,
    InputGroupAddon,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter
} from 'reactstrap';


const ChatRoom = () => {
    const dummy = useRef();

    const user = useContext(UserContext);
    const { displayName } = user;

    const [users, setUsers] = useState([]);
    const [onlineusers, setOnlineUsers] = useState([]);

    const { room, id } = useParams();

    const chatsRef = firestore.collection('chats');
    const query = chatsRef.where("roomname", "==", room);

    const [chats] = useCollectionData(query, { idField: 'id' });

    const roomUsersRef = firestore.collection('roomusers');

    const[topic, setTopic] = useState("");

    const [chatMessage, setChatMessage] = useState('');

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const mailTo = (email) => {
        window.location.href = "mailto:" + email;
    }


    useEffect(() => {
        const fetchData = async () => {
            firestore.collection("rooms").where("roomname", "==", room)
            .onSnapshot(function (querySnapshot) {
                setTopic("");
                querySnapshot.forEach(function(doc) {
                    setTopic(doc.data().idea)
                });
            });
        };
      
        fetchData();
    }, [room]);

    useEffect(() => {
        const fetchData = async () => {
            firestore.collection("roomusers").where("roomname", "==", room)
            .onSnapshot(function (querySnapshot) {
                setUsers([]);
                var onlineroomusers = [];
                querySnapshot.forEach(function(doc) {
                    if(doc.data().status == "online") {
                        onlineroomusers.push(doc.data());
                    }
                });
                setUsers(onlineroomusers);
            });
        };
      
        fetchData();
    }, [room]);

    useEffect(() => {
        const fetchData = async () => {
                firestore.collection("users").where("displayName", "!=", null)
                .onSnapshot(function (querySnapshot) {
                    setOnlineUsers([]);
                    var actualusers = [];
                    querySnapshot.forEach(function(doc) {
                        for(var i = 0; i < users.length; i++) {
                            if(users[i].displayName == doc.data().displayName){
                                actualusers.push(doc.data());
                                console.log(doc.data().strengths);
                            }
                        }
                    
                    });
                    setOnlineUsers(actualusers);
                });
        }

        fetchData();
    }, [users]);


    const sendMessage = async (e) => {
        e.preventDefault();

        await chatsRef.add({
          message: chatMessage,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          roomname: room,
          displayName: displayName,
          type: "message"
        });

        setChatMessage('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
      }

    const exitChat = async () => {
        await chatsRef.add({
          message: displayName + " left "+ room,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          roomname: room,
          displayName: displayName,
          type: "exit"
        });

        var updateStatusQuery = firestore.collection('roomusers').where('roomname','==', room);
        updateStatusQuery.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if(doc.data().displayName == displayName){
                doc.ref.update({status: "offline"});
            }
          });
        });

        firestore.collection("rooms").doc(id).update({
            count: firebase.firestore.FieldValue.increment(-1)
        })

        navigate("/");
    }

    const updateTopic = async (message) => {
        var updateTopicQuery = firestore.collection('rooms').where('roomname','==', room);
        updateTopicQuery.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({idea: message});
          });
        });
    }

    return (
        <div className="Container greyBackground">
            <span ref={dummy}></span>
            <Container>
                <Row>
                    <Col xs="4">
            <header className = "StickyHeader text-center">
            <h4 className = "font-weight-bold">{room} ✨</h4>
            <h6>Tentative Idea: { topic } </h6>
            
            </header>
                        <div className = "padding50">
                            <Card className="UsersCard">
                                <CardBody className="card bg-white">
                                    <CardSubtitle>
                                        <Button className="exitChatButton btn btn-dark" type="button" onClick={() => { exitChat() }}>
                                            Exit Group
                                        </Button>
                                    </CardSubtitle>
                                </CardBody>
                            </Card>
                            <Card className="UsersCard">
                                <CardBody className="card bg-white">
                                    <h5>Members</h5>
                                    <hr className = "pt-0 mt-0" />
                                    {onlineusers.map((user, id) =>
                                        <div key = {id}>
                                            {user.displayName == displayName ?
                                                <CardSubtitle className = "p-1">{ user.displayName } (You)</CardSubtitle>
                                            :
                                            <span>
                                                <CardSubtitle className = "p-1">{ user.displayName } <button onClick={toggle} class = "badge badge-info">Profile</button></CardSubtitle>
                                                <Modal isOpen={modal} toggle={toggle}>
                                                    <ModalBody>
                                                        <div
                                                          style={{
                                                            background: `url(${user.photoURL || 'https://image.flaticon.com/icons/png/512/194/194938.png'})  no-repeat center center`,
                                                            backgroundSize: "cover",
                                                            height: "75px",
                                                            width: "75px"
                                                          }}
                                                          className="mt-2 mb-0 mx-auto"
                                                        ></div>
                                                        <div className>
                                                        <h4 className = "text-center mt-2 mb-0">Hi, I'm {user.displayName}!</h4>
                                                        { user.bio !== "" && (<div>
                                                        <h6 className = "text-center">I'm a <span className = "text-primary">{ user.major }</span> major.</h6>
                                                        <p className = "text-center border bg-dark text-white p-2 rounded mt-3"> { user.bio }</p>
                                                        <p className = "text-center mb-0">My strengths include:</p>
                                                        <div className = "text-center mt-0 mb-4">
                                                        
                                                            {user.strengths.map((strength, sid) => 
                                                            <span key = {sid} className = "badge badge-info p-2 m-1">
                                                                { strength }
                                                            </span>
                                                            )}
                                                        
                                                        
                                                        </div>
                                                        </div>
                                                        )}
                                                        <small className = "form-text text-muted text-center">You can also contact me at <a href = "#" action onClick = {() => {mailTo(user.email)}}>{user.email}</a>.</small>
                                                        </div>
                                                
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <button type = "button" class="btn btn-secondary" onClick={toggle}>Close</button>
                                                    </ModalFooter>
                                                </Modal>
                                            </span>
                                            }
                                        </div>
                                            
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    </Col>
                    <Col xs="8">
                        <div className = "chatPadding">
                        <div className = "ChatContent bg-white">
                            {chats && chats.map((chat, id) => (
                                <div className="MessageBox" key = {id}>
                                {chat.type === "join" || chat.type === "exit" ?
                                        <div className="ChatStatus">
                                        <span className="ChatContentCenter">{chat.message}</span>
                                        </div>
                                        :
                                        <div className="ChatMessage">
                                            <div className={`${chat.displayName === displayName? "RightBubble":"LeftBubble"}`}>
                                                {chat.displayName === displayName ?
                                                    <span className="MsgName">Me</span>
                                                    :
                                                    <span className="MsgName">{chat.displayName}<span className = "float-right heartAction" action onClick={() => { updateTopic(chat.message); }}>🤍</span></span>
                                                }
                                                <p>{chat.message}</p>
                                                </div>
                                            </div>
                                }
                                </div>
                            ))}
                        </div>
                        </div>
                        <footer className="StickyFooter">
                            <Form className="MessageForm" onSubmit={sendMessage}>
                                <InputGroup>
                                <Input className="messageInput" type="text" name="message" id="message" placeholder="Enter message here" value = {chatMessage} onChange={(e) => setChatMessage(e.target.value)}/>
                                    <InputGroupAddon addonType="append">
                                        <Button className="sendButton btn btn-dark" type="submit">Send</Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Form>
                        </footer>
                    </Col>
                </Row>
            </Container>
        </div>
    );
        
}

export default ChatRoom;