// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCIZn8NmNqICZqkEevSpjTA33FhATJ_Dak",
    authDomain: "sherazpos.firebaseapp.com",
    databaseURL: "https://sherazpos-default-rtdb.firebaseio.com",
    projectId: "sherazpos",
    storageBucket: "sherazpos.appspot.com",
    messagingSenderId: "597415567946",
    appId: "1:597415567946:web:9eb38d977357f825273cb3",
    measurementId: "G-56K9B8HK61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Realtime Database
const database = getDatabase(app);
const db = getDatabase(app);

export { database,db };

