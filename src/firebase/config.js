import { initializeApp } from "../../node_modules/firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCGLYE30QXr9DL6brw5n0pEW4fpHY-vEv8",
  authDomain: "carp-51680.firebaseapp.com",
  projectId: "carp-51680",
  storageBucket: "carp-51680.appspot.com",
  messagingSenderId: "379191111900",
  appId: "1:379191111900:web:a01b95c6daacfaccf70419"
};

const app = initializeApp(firebaseConfig);

export const auth=getAuth(app)

export const db=getFirestore(app);