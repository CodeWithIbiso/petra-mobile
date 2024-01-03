// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCJFtUUcBKmnr6CLK8KNsARERcuGBUXLIs',
  authDomain: 'petra-messaging-tutorial.firebaseapp.com',
  projectId: 'petra-messaging-tutorial',
  storageBucket: 'petra-messaging-tutorial.appspot.com',
  messagingSenderId: '195655756558',
  appId: '1:195655756558:web:251a0bde01745b4d49455f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);
