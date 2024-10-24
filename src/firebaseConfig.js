import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB8_AQv7kYmfrJ041WixGUx4vCeGyRmuf0",
    authDomain: "pwaproyectods01.firebaseapp.com",
    projectId: "pwaproyectods01",
    storageBucket: "pwaproyectods01.appspot.com",
    messagingSenderId: "430374877901",
    appId: "1:430374877901:web:35a3ce1b59eccc04a50784"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
