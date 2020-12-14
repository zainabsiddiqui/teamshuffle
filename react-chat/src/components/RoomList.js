import React, { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { navigate, Link } from "@reach/router";
import {auth, getRoomDocuments} from "../Firebase";
import firebase from '../Firebase';
import { firestore } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import '../Styles.css';

import {
    Jumbotron,
    Spinner,
    Button,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter
} from 'reactstrap';


const RoomList = () => {
  const user = useContext(UserContext);
  const {displayName, instructor} = user;

  const [showLoading, setShowLoading] = useState(false);

  const roomsRef = firestore.collection('rooms');
  const query = roomsRef.orderBy("roomname");

  const [rooms] = useCollectionData(query, { idField: 'id'});

  const roomUsersRef = firestore.collection('roomusers');

  const [groupSize, setGroupSize] = useState(0);

  firestore.collection("settings").doc("groupSettings")
    .onSnapshot(function(doc) {
        setGroupSize(doc.data().groupSize);
    });
  
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  // Enter the chatroom user clicked given the roomname, id, and count
  const enterChatRoom = async (roomname, roomid, roomcount) => {

    const chatsRef = firestore.collection('rooms').doc(roomid).collection("chats");

    // If room is full, pull up the modal that says room is full
    if(roomcount == groupSize && !instructor) {
      toggle();
    } else {

      // Room is not full, so add the user to the list of users in the room and update user status
      firestore.collection("roomusers").doc(user.uid).set({
          roomname: roomname,
          displayName: displayName,
          status: "online"
      });

      // Instructors are ghosts and don't get counted in our room count
      if(!instructor) {

        // Increment the user count for that room
        firestore.collection("rooms").doc(roomid).update({
            count: firebase.firestore.FieldValue.increment(1)
        });

        await chatsRef.add({
            message: displayName + " joined " + roomname,
            createdAt: new Date().getTime(),
            displayName: displayName,
            type: "join"
        });

      } else {
          await chatsRef.add({
            message: displayName + "⭐ joined " + roomname,
            createdAt: new Date().getTime(),
            displayName: displayName,
            type: "join"
          });

      }

      let roomURL = "chatroom/" + roomname + "/" + roomid;
      navigate(roomURL);
    }
  }

  // Randomizer feature which shuffles user into a random room from the current room list
  const shuffle = async () => {

    // Get a random integer
    var randomInt = getRandomInt(rooms.length);
    
    const chatsRef = firestore.collection('rooms').doc(rooms[randomInt].id).collection("chats");

    firestore.collection("roomusers").doc(user.uid).set({
        roomname: rooms[randomInt].roomname,
        displayName: displayName,
        status: "online"
    });

    if(!instructor) {

      firestore.collection("rooms").doc(rooms[randomInt].id).update({
          count: firebase.firestore.FieldValue.increment(1)
      });

      await chatsRef.add({
            message: displayName + " joined " + rooms[randomInt].roomname,
            createdAt: new Date().getTime(),
            displayName: displayName,
            type: "join"
      });
    } else {
      await chatsRef.add({
            message: displayName + "⭐ joined " + rooms[randomInt].roomname,
            createdAt: new Date().getTime(),
            displayName: displayName,
            type: "join"
      });
    }

    let roomURL = "chatroom/" + rooms[randomInt].roomname + "/" + rooms[randomInt].id;
    navigate(roomURL);

  }

  // Custom random integer function
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  // Delete the chatroom the user selected to delete
  const deleteChatRoom = async (roomname, roomid) => {
    setShowLoading(true);

    // Delete all of the messages in the chats subcollection of rooms in Firestore
    firestore.collection("rooms").doc(roomid).collection("chats").get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
        console.log("Deleted");
      })
    });

    // Delete the room document itself
    firestore.collection("rooms").doc(roomid).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

    navigate("/")

    setShowLoading(false);

  }




  return (
    <Jumbotron className = "Jumbotron1">
    {showLoading &&
                <Spinner color="primary" />
            }
          <div className = "float-right">
          {instructor ?
            <button className = "btn btn-info mt-1"><Link to="groupSettings" className = "profilepage text-decoration-none text-white">
            Set Group Max
            </Link></button>
          :
            <button className = "btn btn-info mt-1"><Link to="profilepage" className = "profilepage text-decoration-none text-white">
            Update Profile
            </Link></button>
          }
            &nbsp;
            <button className = "btn btn-dark mt-1 mr-1" onClick = {() => {auth.signOut()}}>Sign Out</button>
          </div>
          {instructor ?
            <h5 className="h5 mb-0">Welcome, <strong>{displayName}</strong>! ⭐</h5>
          :
            <h5 className="h5 mb-0">Welcome, <strong>{displayName}</strong>! </h5>
          }
          <h1 className="h1 mt-0"><span class = "badge badge-dark">Your Dashboard</span></h1>
          <hr />
          <div className = "mt-3">
            <div className = "mb-1 mt-1">
              <h5 className = "mb-1 bold">Groups:</h5>
              Pssst. Have a novel idea for a project?&nbsp;
              <Link className = "addroom" to="addroom">Create your own group.</Link>
            </div>
            <div>
              <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Group Max Exceeded</ModalHeader>
              <ModalBody>
              Unfortunately, the group you selected is full. Please select another group or <Link className = "addroom" to="addroom">create your own</Link>.
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={toggle}>Close</Button>
              </ModalFooter>
            </Modal>
          </div>
            
            <ListGroup>
              {rooms && rooms.map(room => <ListGroupItem className = "listGroup mb-2 pb-2" key={room.id} action onClick={() => { enterChatRoom(room.roomname, room.id, room.count) }}>
                <span>
                  <span className = "font-weight-bold">{room.roomname}</span> <span className = "count badge badge-pill badge-info">{room.count}/{ groupSize }</span>
                  {room.creator == user.uid || instructor ? 
                  <a href = "" action onClick={() => { deleteChatRoom(room.roomname, room.id) }} className = "DeleteRoom">✖</a>
                  :
                  <span></span>
                  }
                </span>
                <div>
                  <p className ="idea text-muted mb-0 pb-0">Idea: {room.idea}</p>
                </div>
                </ListGroupItem>)}
            </ListGroup>
            <hr />
            <div className = "text-center">
            Feeling adventurous?
            <button className = "btn btn-dark mb-2 mt-2 w-100" onClick = {() => {shuffle()}}>Shuffle Me</button>
            </div>
          </div>
    </Jumbotron>
  );
};

export default RoomList;