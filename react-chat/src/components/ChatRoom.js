import React, { useContext, useState, useRef, forceUpdate } from "react";
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

    const { room } = useParams();

    const chatsRef = firestore.collection('chats');
    const query = chatsRef.where("roomname", "==", room);

    const [chats] = useCollectionData(query, { idField: 'id' });

    const[topic, setTopic] = useState("");

    console.log(chats);

    const [chatMessage, setChatMessage] = useState('');

    var docRef = firestore.collection("rooms");
    // var topic;

    // const promises = [];

    // const grabTopicIdea = async (ref) => {

    // let query = ref.where('roomname', '==', room)
    // .get()
    // .then(snapshot => {
    // if (snapshot.empty) {
    //   console.log('No matching documents.');
    //   return;
    // }  

    // snapshot.forEach(doc => {
    //   // Do something
    //     promises.push(doc.data().idea);
    // });
    //   })
    //   .catch(err => {
    //     console.log('Error getting documents', err);
    //   });
    // }


    function getTopic() {
    return new Promise((resolve, reject) => {
            firestore
            .collection("rooms")
            .where("roomname", "==", room)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log("No matching documents.");
                }

                snapshot.forEach(doc => {
                //   // Do something
                    resolve(doc.data().idea)
                });
            })
            .catch(function(error) {
                console.log("Error getting document:", error);
                reject(error);
            });
    });
}      

    
        getTopic().then((data) => {
            // window.topicText = data;
            setTopic(data);
        }).catch((error) => {
            console.log(error + "An error occurred. Duh!")
        });

    
    // let docRef = firestore.collection('rooms').where("roomname", "==", room);

    // const getTopic = async (ref) => {

    //     const topic = await ref.get()
    //       .then(snapshot => {
    //         if (snapshot.empty) {
    //             console.log('No matching documents.');
    //             return;
    //         } 

    //         snapshot.forEach(doc => {
    //             return doc.data().idea;
    //         });

    //       })
    //       .catch(err => {
    //         console.log('Error getting document', err);
    //       });
    // }

    // var promise = getTopic(docRef);

    // console.log(promise);


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

        navigate("/");
    }

    const updateTopic = async (message) => {
        var updateTopicQuery = firestore.collection('rooms').where('roomname','==', room);
        updateTopicQuery.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({idea: message});
          });
        });

        setTopic(message);
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
                            
                                <Card className="UsersCard">
                                    <CardBody className="card bg-white">
                                        <CardSubtitle>{ displayName }</CardSubtitle>
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