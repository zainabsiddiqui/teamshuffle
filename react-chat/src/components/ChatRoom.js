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
    InputGroupAddon
} from 'reactstrap';

const ChatRoom = () => {
    const dummy = useRef();

    const user = useContext(UserContext);
    const { displayName } = user;

    const [users, setUsers] = useState([]);

    const { room } = useParams();

    const chatsRef = firestore.collection('chats');
    const query = chatsRef.where("roomname", "==", room);

    const [chats] = useCollectionData(query, { idField: 'id' });

    const roomUsersRef = firestore.collection('roomusers');

    const[topic, setTopic] = useState("");

    const [chatMessage, setChatMessage] = useState('');

    var docRef = firestore.collection("rooms");


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
                var onlineusers = [];
                querySnapshot.forEach(function(doc) {
                    if(doc.data().status == "online") {
                        onlineusers.push(doc.data());
                    }
                });
                setUsers(onlineusers);
            });
        };
      
        fetchData();
    }, [room]);

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
            <h6>Idea: { topic } </h6>
            
            </header>
                        <div className = "padding50">
                            <Card className="UsersCard">
                                <CardBody className="card bg-white">
                                    <CardSubtitle>
                                        <Button className="exitChatButton btn btn-info" type="button" onClick={() => { exitChat() }}>
                                            Exit Group
                                        </Button>
                                    </CardSubtitle>
                                </CardBody>
                            </Card>
                            {users.map((user, id) =>
                                <Card className="UsersCard" key = {id}>
                                    <CardBody className="card bg-white">
                                        <CardSubtitle>{ user.displayName }</CardSubtitle>
                                    </CardBody>
                                </Card>
                            )}
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
                                        <Button className="sendButton btn btn-primary" type="submit">Send</Button>
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