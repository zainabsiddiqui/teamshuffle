import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
    projectId: 'teamshuffle-2b5e7', 
    apiKey: 'AIzaSyBtjVbEiceoUVQUnhJZlegrxecJ9GmQlos',
    databaseURL: 'https://teamshuffle-2b5e7.firebaseio.com'
  };
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;