import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const firebaseConfiguration = {
  apiKey: "AIzaSyDfqQgC5nCKW0k236HlIiZn0B0E-Kw0FYw",
  authDomain: "docfeed.firebaseapp.com",
  projectId: "docfeed",
  storageBucket: "docfeed.firebasestorage.app",
  messagingSenderId: "584547794889",
  appId: "1:584547794889:web:746f61b5a40bf01559f218",
};
const app = initializeApp(firebaseConfiguration);

const db = getFirestore(app);

export const saveToFirebase = async (content) => {
  console.log("Content to save:", content);

  await setDoc(doc(db, "documents", "my-first-doc"), {
    html: content,
    savedAt: new Date(),
  });

  console.log("Saved to Firebase! 🎉");
};
