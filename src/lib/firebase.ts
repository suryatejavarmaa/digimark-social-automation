import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCP441OctDxPAIS9rSwRCJ7bxmJaktVS58",
    authDomain: "digimark-ce146.firebaseapp.com",
    projectId: "digimark-ce146",
    storageBucket: "digimark-ce146.firebasestorage.app",
    messagingSenderId: "305387226790",
    appId: "1:305387226790:web:a9a4a406253d50c4ce1667",
    measurementId: "G-ENN3N6ZHGJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
