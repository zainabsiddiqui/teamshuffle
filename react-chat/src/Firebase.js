import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { functions } from "firebase";
import "react-firebase-hooks/firestore"


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

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, displayName, photoURL, instructor } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        instructor,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

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