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
    ListGroupItem
} from 'reactstrap';

import Moment from 'moment';


const RoomList = () => {
  const user = useContext(UserContext);
  const {displayName} = user;

  const roomsRef = firestore.collection('rooms');
  const query = roomsRef.orderBy("roomname");

  const [rooms] = useCollectionData(query, { idField: 'id'});

  const chatsRef = firestore.collection('chats');

  const roomUsersRef = firestore.collection('roomusers');

  const [groupSize, setGroupSize] = useState(0);

  // var settingsRef = firestore.collection("settings").doc("groupSettings");
  // settingsRef.get().then(function(doc) {
  //   if (doc.exists) {
  //       setGroupSize(doc.data().groupSize);
  //   } else {
  //       console.log("No such document!");
  //   }
  // }).catch(function(error) {
  //     console.log("Error getting document:", error);
  // });

  firestore.collection("settings").doc("groupSettings")
    .onSnapshot(function(doc) {
        setGroupSize(doc.data().groupSize);
    });
  


  const enterChatRoom = async (roomname, roomid, roomcount) => {

    if(roomcount == groupSize) {
        alert("You're not allowed.");
    } else {

      firestore.collection("roomusers").doc(user.uid).set({
          roomname: roomname,
          displayName: displayName,
          status: "online"
      });

      firestore.collection("rooms").doc(roomid).update({
          count: firebase.firestore.FieldValue.increment(1)
      });

      await chatsRef.add({
            message: displayName + " joined " + roomname,
            createdAt: Moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
            roomname: roomname,
            displayName: displayName,
            type: "join"
      });


      let roomURL = "chatroom/" + roomname + "/" + roomid;
      console.log(roomURL);
      navigate(roomURL);
    }
  }

  const shuffle = async () => {
    var randomInt = getRandomInt(rooms.length);
    console.log(randomInt);
    console.log(rooms[randomInt].roomname);
    console.log(rooms[randomInt].id);

    firestore.collection("roomusers").doc(user.uid).set({
        roomname: rooms[randomInt].roomname,
        displayName: displayName,
        status: "online"
    });

    firestore.collection("rooms").doc(rooms[randomInt].id).update({
        count: firebase.firestore.FieldValue.increment(1)
    });

    await chatsRef.add({
          message: displayName + " joined " + rooms[randomInt].roomname,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          roomname: rooms[randomInt].roomname,
          displayName: displayName,
          type: "join"
    });

    let roomURL = "chatroom/" + rooms[randomInt].roomname + "/" + rooms[randomInt].id;
    navigate(roomURL);

  }

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const deleteChatRoom = async (roomname) => {
    var deletingRoomQuery = firestore.collection('rooms').where('roomname','==', roomname);
    deletingRoomQuery.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });

    var deletingChatsQuery = firestore.collection('chats').where('roomname','==', roomname);
    deletingChatsQuery.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });

    navigate("/")

  }




  return (
    <div>
      
    <Jumbotron className = "Jumbotron1">
          <div className = "float-right">
            <button className = "btn btn-info mt-1"><Link to="profilepage" className = "profilepage text-decoration-none text-white">
            Update Profile
          </Link></button>
            &nbsp;
            <button className = "btn btn-dark mt-1 mr-1" onClick = {() => {auth.signOut()}}>Sign Out</button>
          </div>
          <h5 className="h5">Welcome, {displayName}! </h5>
          <h1 className="h1">Dashboard 🕊️</h1>
          <hr />
          <div className = "mt-3">
            <div className = "mb-1 mt-1">
              <h4 className = "mb-0">Groups:</h4>
              Pssst. Have a novel idea for a project?&nbsp;
              <Link className = "addroom" to="addroom">Create your own group.</Link>
            </div>
            
            <ListGroup>
              {rooms && rooms.map(room => <ListGroupItem className = "listGroup" key={room.id} action onClick={() => { enterChatRoom(room.roomname, room.id, room.count) }}>
                <span>
                  <span className = "font-weight-bold">{room.roomname}</span>
                  {room.creator == user.uid ? 
                  <a href = "" action onClick={() => { deleteChatRoom(room.roomname) }} className = "DeleteRoom">✖</a>
                  :
                  <span></span>
                  }
                </span>
                <div>
                  <span className = "count badge badge-info">Members: <strong>{room.count}/{ groupSize }</strong></span>
                </div>
                <div>
                  <span className ="idea">Idea: {room.idea}</span>
                </div>
                </ListGroupItem>)}
            </ListGroup>
            <hr />
            <div className = "text-center">
            Or, if you're feeling adventurous...
            <button className = "btn btn-secondary mb-2 mt-2 w-100" onClick = {() => {shuffle()}}>Shuffle Me</button>
            </div>
          </div>
    </Jumbotron>
    </div>
  );
};

export default RoomList;