// firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  where,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// Your Firebase configuration
const firebaseConfiguration = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "docfeed.firebaseapp.com",
  projectId: "docfeed",
  storageBucket: "docfeed.firebasestorage.app",
  messagingSenderId: "584547794889",
  appId: "1:584547794889:web:746f61b5a40bf01559f218",
};

// Initialize Firebase
const app = initializeApp(firebaseConfiguration);

// Get Firestore instance
const db = getFirestore(app);

/**
 * Save a document to Firestore with a title and HTML content.
 * @param {Object} data
 * @param {string} data.title - The title of the document.
 * @param {string} data.content - The HTML content to save.
 */
export const saveToFirebase = async ({ title, html, author }) => {
  try {
    const docRef = await addDoc(collection(db, "documents"), {
      title,
      html,
      author,
      savedAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error saving document:", error);
  }
};

/**
 * Fetch all saved documents from Firestore, ordered by most recent.
 * @returns {Promise<Array>} Array of documents with id, title, html, savedAt
 */
export const fetchDocuments = async () => {
  try {
    const docsQuery = query(
      collection(db, "documents"),
      orderBy("savedAt", "desc")
    );

    const querySnapshot = await getDocs(docsQuery);

    const docsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return docsList;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
};

/**
 * Fetch a single document by its ID.
 * @param {string} id - Firestore document ID.
 * @returns {Promise<Object|null>} The document object or null if not found.
 */
export const fetchDocumentById = async (id) => {
  try {
    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn(`Document with id "${id}" not found.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching document with id "${id}":`, error);
    return null;
  }
};

export async function UserLogin(username, password) {
  try {
    const credentialRef = collection(db, "credentials");
    const q = query(credentialRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: "Invalid credentials",
        user: null,
      };
    }

    // Get the first (should be only) matching user
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Check password
    if (userData.password !== password) {
      return {
        success: false,
        message: "Invalid credentials",
        user: null,
      };
    }

    // Return success with user data (excluding password for security)
    return {
      success: true,
      message: "Login successful",
      user: {
        id: userDoc.id,
        username: userData.username,
        role: userData.role,
        image: userData.image || null,
      },
      userId: userDoc.id,
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message: "Login failed. Please try again.",
      user: null,
    };
  }
}

/**
 * Delete a document from Firestore by its ID.
 * @param {string} id - Firestore document ID to delete.
 * @returns {Promise<void>}
 */
export const deleteDocument = async (id) => {
  try {
    const docRef = doc(db, "documents", id);
    await deleteDoc(docRef);
    console.log(`Document with ID "${id}" deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting document with ID "${id}":`, error);
  }
};

/**
 * Update a document in Firestore by its ID.
 * @param {string} id - Firestore document ID to update.
 * @param {Object} data - Fields to update in the document.
 * @returns {Promise<void>}
 */
export const updateDocument = async (id, data) => {
  try {
    const docRef = doc(db, "documents", id);
    await updateDoc(docRef, {
      ...data,
      savedAt: new Date(), // optionally update the timestamp
    });
    console.log(`Document with ID "${id}" updated successfully.`);
  } catch (error) {
    console.error(`Error updating document with ID "${id}":`, error);
  }
};
/**
 * Fetch all documents by a specific author.
 * @param {string} author - Author's name to filter documents.
 * @returns {Promise<Array>} Array of documents by the author.
 */
export const fetchDocumentsByAuthor = async (author) => {
  try {
    const docsQuery = query(
      collection(db, "documents"),
      where("author", "==", author)
    );

    const querySnapshot = await getDocs(docsQuery);

    const docsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return docsList;
  } catch (error) {
    console.error(`Error fetching documents for author "${author}":`, error);
    return [];
  }
};
