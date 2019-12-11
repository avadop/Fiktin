import firebase from 'firebase/app'
import 'firebase/firestore'

// Your web app's Firebase configuration
const config = {
  apiKey: 'AIzaSyBTbP0C9dh3olwn1XowNAhKnZ02Kgsz8UI',
  authDomain: 'fiktin-cac14.firebaseapp.com',
  databaseURL: 'https://fiktin-cac14.firebaseio.com',
  projectId: 'fiktin-cac14',
  storageBucket: 'fiktin-cac14.appspot.com',
  messagingSenderId: '898364500542',
  appId: '1:898364500542:web:3dbaffbcae8951938aff6f'
}

// Initialize Firebase
firebase.initializeApp(config)

export const db = firebase.firestore()
// database.settings({
//   timestampsInSnapshots: true
// });

// database.enablePersistence();

export const userCollection = db.collection('users')
export const booksCollection = db.collection('books')
export const librariesCollection = db.collection('libraries')
