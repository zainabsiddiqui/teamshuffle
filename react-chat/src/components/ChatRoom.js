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
import ScrollToBottom from 'react-scroll-to-bottom';


const ChatRoom = () => {
    const dummy = useRef();

    const user = useContext(UserContext);
    const { displayName, instructor } = user;

    const [users, setUsers] = useState([]);
    const [onlineusers, setOnlineUsers] = useState([]);

    const { room, id } = useParams();

    const chatsRef = firestore.collection('rooms').doc(id).collection("chats");

    const [chats, setChats] = useState([]);

    const roomUsersRef = firestore.collection('roomusers');

    const[topic, setTopic] = useState("");

    const [chatMessage, setChatMessage] = useState('');

    // Handles the modal that pops up for user profile
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    var profEmail = "placeholderprof@gmail.com";

    // Grabs which of the users is admin
    firestore.collection("users").where("instructor", "==", true)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            profEmail = doc.data().email;
        });
    })
    .catch(function(error) {
        console.log("Error getting professor email: ", error);
    });

    // Handles the mailto link for user email in profile
    const mailToContact = (email) => {
        window.location.href = "mailto:" + email;
    }

    // Handles the mail to professor feature
    const mailToProf = (email) => {

        var listOfMembers = [];
        // Grab the list of online users MINUS the professor/instructor/admin
        for(var i = 0; i < onlineusers.length; i++) {
            if(!onlineusers[i].instructor) {
                listOfMembers.push(onlineusers[i].displayName);
            }
            
        }

        // Builds up the href for the mailto
        var body = "Hi Professor,%0D%0A%0D%0AThis is group name " + room + "! We have decided that our project idea/topic will be '" + topic 
                + "'. Please let us know if you think it is suitable or if you have any comments or considerations to make.%0D%0AOur members are as follows: " 
                + listOfMembers.join(', ') + ".%0D%0A%0D%0AThank you!";
                console.log(body);
        window.location.href = "mailto:" + profEmail + "?subject=Group Selection&body=" + body;
    }

    // Realtime updates for topic idea for this chatroom
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

    // Realtime updates for chat messages for this chatroom
    useEffect(() => {
    const messagesListener = firestore
      .collection('rooms')
      .doc(id)
      .collection('chats')
      .orderBy('createdAt', 'asc')
      .onSnapshot(function (querySnapshot) {
        setChats([]);
        var messages = [];
        querySnapshot.forEach(function(doc) {
            messages.push(doc.data());
        });
        setChats(messages);
        console.log(messages);
      });

    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
    }, []);

    // Realtime updates for online room/group users
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


    // Adds the message that the user typed out to Firestore
    const sendMessage = async (e) => {
        e.preventDefault();

        await chatsRef.add({
            message: chatMessage,
            createdAt: new Date().getTime(),
            displayName: displayName,
            type: "message"
        });

        setChatMessage('');
      }

    // Have the current user exit the chatroom
    const exitChat = async () => {

        // Update user's status to offline
        var updateStatusQuery = firestore.collection('roomusers').where('roomname','==', room);
        updateStatusQuery.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if(doc.data().displayName == displayName){
                doc.ref.update({status: "offline"});
            }
          });
        });
        
        // Instructor is a ghost, so we don't count them leaving or entering
        if(!instructor) {

            // Decrement the count in the current room
            firestore.collection("rooms").doc(id).update({
                count: firebase.firestore.FieldValue.increment(-1)
            })

            // Add the leaving message to Firestore
            await chatsRef.add({
              message: displayName + " left "+ room,
              createdAt: new Date().getTime(),
              displayName: displayName,
              type: "exit"
            });
        } else {
            await chatsRef.add({
              message: displayName + "⭐ left "+ room,
              createdAt: new Date().getTime(),
              displayName: displayName,
              type: "exit"
            });
        }

        navigate("/");
    }

    // If user hearts a message, add it to Firestore as the topic
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
            <Container>
                <Row>
                    <Col xs="4">
            
                        <div className = "padding50">
                        <Card className="UsersCard">
                                <CardBody className="card bg-white">
                                    <CardSubtitle>
                                        <small className = "small-text text-muted">Welcome to</small>
                                        <h4 className = "font-weight-bold">{room}! ✨</h4>
                                        <p className = "text-center border bg-info text-white p-1 rounded mt-1 mb-0"><strong>Idea:</strong> { topic }</p>
                                    </CardSubtitle>
                                </CardBody>
                            </Card>
                            <Card className="UsersCard">
                                <CardBody className="card bg-white">
                                    <p className = "mb-1"><strong>Members</strong></p>
                                    <hr className = "pt-0 mt-0" />
                                    {onlineusers.map((user, id) =>
                                        <div key = {id}>
                                            {user.displayName == displayName ?
                                                <CardSubtitle className = "p-1">{ user.displayName } (You)</CardSubtitle>
                                            :
                                            <span>
                                                <CardSubtitle className = "p-1">
                                                {user.instructor ?
                                                    <span>{ user.displayName } <span class = "float-right">⭐</span></span>
                                                : 
                                                    <span>{ user.displayName } <button onClick={toggle} class = "badge badge-info float-right">Profile</button></span>
                                                }
                                                </CardSubtitle>
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
                                                        <small className = "form-text text-muted text-center">You can also contact me at <a href = "#" action onClick = {() => {mailToContact(user.email)}}>{user.email}</a>.</small>
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
                            <Card className="UsersCard">
                                <CardBody className="card greyBackground border-0">
                                    <CardSubtitle>
                                        <Button className="exitChatButton btn btn-secondary float-left" type="button" onClick={() => { exitChat() }}>
                                            Exit Group
                                        </Button>
                                        <a href = "#" className="btn btn-dark float-right" onClick={() => { mailToProf() }}>Email Prof</a>
                                    </CardSubtitle>
                                </CardBody>
                            </Card>
                        </div>
                    </Col>
                    <Col xs="8">
                        <ScrollToBottom className = "ChatContent bg-white pb-3 pt-3">
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
                        </ScrollToBottom>
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