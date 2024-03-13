import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyAhceFeuK5EvozLjeqMvIxhD6_7oCUnTHA",
  authDomain: "food-genie-9570b.firebaseapp.com",
  projectId: "food-genie-9570b",
  storageBucket: "food-genie-9570b.appspot.com",
  messagingSenderId: "709873368410",
  appId: "1:709873368410:web:82a1a335bfde117900c763"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

export { app, auth, database };
