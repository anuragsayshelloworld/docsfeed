import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'docfeed.firebaseapp.com',
  projectId: 'docfeed',
  storageBucket: 'docfeed.firebasestorage.app',
  messagingSenderId: '584547794889',
  appId: '1:584547794889:web:746f61b5a40bf01559f218',
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
