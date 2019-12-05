import Firebase from 'firebase'

let config = {
  apiKey: "AIzaSyBTbP0C9dh3olwn1XowNAhKnZ02Kgsz8UI",
  authDomain: "fiktin-cac14.firebaseapp.com",
  databaseURL: "https://fiktin-cac14.firebaseio.com",
  projectId: "fiktin-cac14",
  storageBucket: "fiktin-cac14.appspot.com",
  messagingSenderId: "898364500542",
  appId: "1:898364500542:web:3dbaffbcae8951938aff6f",
  measurementId: "G-V4MESKQSNR"
}

let app = Firebase.initializeApp(config)
export const db = app.database()