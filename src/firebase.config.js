import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBAJEwlFdMeY2dRFcXmQ291GtaPCYg8YJo",
    authDomain: "house-marketplace-app-47eb8.firebaseapp.com",
    projectId: "house-marketplace-app-47eb8",
    storageBucket: "house-marketplace-app-47eb8.appspot.com",
    messagingSenderId: "823650262925",
    appId: "1:823650262925:web:3b109317c8e1ab68b027c4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();