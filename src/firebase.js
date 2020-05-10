import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'

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

// Estado de la conexión
export const connectedRef = firebase.database().ref('.info/connected')
export const storageFirebase = firebase.storage()

// Colecciones
export const userCollection = db.collection('users')
export const booksCollection = db.collection('books')
export const librariesCollection = db.collection('libraries')
export const tagsCollection = db.collection('tags')
export const sectionsCollection = db.collection('sections')

export const defaultImageBook = 'https://firebasestorage.googleapis.com/v0/b/fiktin-cac14.appspot.com/o/default_book_picture%2Fblack-and-white-book-cover-clip-art-book-of-images.jpg?alt=media&token=31470ce3-ad63-47c9-8b14-f19abddfde8c'
export const defaultImageUser = 'https://firebasestorage.googleapis.com/v0/b/fiktin-cac14.appspot.com/o/default_user_picture%2Fusuario.jpg?alt=media&token=9dc00bba-5d07-4412-aef5-393e41000e4a'
