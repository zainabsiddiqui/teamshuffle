import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { functions } from "firebase";
import "react-firebase-hooks/firestore"

const settings = {timestampsInSnapshots: true};

const config = {
	apiKey: "AIzaSyCGLQoUtlvPsQWbBvUJ4GZjHH-LAaBnHPk",
    authDomain: "team-shuffle-take-3.firebaseapp.com",
    databaseURL: "https://team-shuffle-take-3.firebaseio.com",
    projectId: "team-shuffle-take-3",
    storageBucket: "team-shuffle-take-3.appspot.com",
    messagingSenderId: "610227548935",
    appId: "1:610227548935:web:ab59fd347614b5e6e40ba2"
}

firebase.initializeApp(config);

firebase.firestore().settings(settings);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};


// Adds the user document for the user signing up to Firestore
export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, displayName, photoURL, instructor } = user;
    var bio = "";
    var strengths = [];
    var major = "";
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        instructor,
        bio,
        major,
        strengths,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

// Grabs the user document from Firestore for the user id provided
const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();

    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

// Grabs the collection of rooms currently in Firestore
export const getRoomDocuments = async (roomsArray) => {
  try {
  	firestore.collection("rooms").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        	roomsArray.push(doc.val());
    	});
	});

    return roomsArray;
  } catch (error) {
    console.error("Error fetching rooms", error);
  }
};

export default firebase;