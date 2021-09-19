import firebase from 'firebase'
// this is firebase 7 version for 8,9 and above import process changes 
const firebaseConfig = {
    apiKey: "AIzaSyAFFNMUF0kIHXgE7QQAFF_CFdqKStQYqZU",
    authDomain: "react-chat-app-ce295.firebaseapp.com",
    projectId: "react-chat-app-ce295",
    storageBucket: "react-chat-app-ce295.appspot.com",
    messagingSenderId: "1054430305581",
    appId: "1:1054430305581:web:c52dac2dabad18465347a4"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};

