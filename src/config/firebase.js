import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCLK_-1fFFR59yoyNtieWSzQHogOYyXGvs',
  authDomain: 'hacku-chousei.firebaseapp.com',
  projectId: 'hacku-chousei',
  storageBucket: 'hacku-chousei.appspot.com',
  messagingSenderId: '234058437730',
  appId: '1:234058437730:web:03d9f8242755a73d982d3b',
  measurementId: 'G-0LGN51GXMZ',
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
