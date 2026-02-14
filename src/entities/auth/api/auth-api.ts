import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../shared/config/firebase';
import type { LoginResult } from '../model/types';

interface FirestoreCredentialRecord {
  username: string;
  password: string;
  role: number;
  image?: string | null;
}

export async function loginUser(
  username: string,
  password: string,
): Promise<LoginResult> {
  try {
    const credentialsRef = collection(firestore, 'credentials');
    const credentialsQuery = query(credentialsRef, where('username', '==', username));
    const querySnapshot = await getDocs(credentialsQuery);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Invalid credentials',
        user: null,
      };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as FirestoreCredentialRecord;

    if (userData.password !== password) {
      return {
        success: false,
        message: 'Invalid credentials',
        user: null,
      };
    }

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: userDoc.id,
        username: userData.username,
        role: userData.role,
        image: userData.image ?? null,
      },
    };
  } catch {
    return {
      success: false,
      message: 'Login failed. Please try again.',
      user: null,
    };
  }
}
