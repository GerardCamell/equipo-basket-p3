import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBUUF5jhHNx2TON-UsgyZ0LyssrWHC2gaw",
  authDomain: "equipo-basket-p2.firebaseapp.com",
  databaseURL: "https://equipo-basket-p2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "equipo-basket-p2",
  storageBucket: "equipo-basket-p2.appspot.com",
  messagingSenderId: "474074122785",
  appId: "1:474074122785:web:a3440b09aa77b492a2f160",
  measurementId: "G-0T52MVSGHZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);