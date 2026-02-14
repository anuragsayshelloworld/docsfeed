import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firestore } from '../../../shared/config/firebase';
import { toMillis } from '../../../shared/lib/date';
import type {
  CreateDocumentInput,
  DocumentRecord,
  UpdateDocumentInput,
} from '../model/types';

function sortByLastSavedDesc(documents: DocumentRecord[]): DocumentRecord[] {
  return [...documents].sort((a, b) => toMillis(b.savedAt) - toMillis(a.savedAt));
}

export async function getDocumentsByAuthor(author: string): Promise<DocumentRecord[]> {
  const documentsRef = collection(firestore, 'documents');
  const documentsQuery = query(documentsRef, where('author', '==', author));
  const querySnapshot = await getDocs(documentsQuery);

  const documents = querySnapshot.docs.map((snapshot) => ({
    id: snapshot.id,
    ...(snapshot.data() as Omit<DocumentRecord, 'id'>),
  }));

  return sortByLastSavedDesc(documents);
}

export async function getDocumentById(id: string): Promise<DocumentRecord | null> {
  const documentRef = doc(firestore, 'documents', id);
  const documentSnapshot = await getDoc(documentRef);

  if (!documentSnapshot.exists()) return null;

  return {
    id: documentSnapshot.id,
    ...(documentSnapshot.data() as Omit<DocumentRecord, 'id'>),
  };
}

export async function createDocument(payload: CreateDocumentInput): Promise<string> {
  const documentRef = await addDoc(collection(firestore, 'documents'), {
    ...payload,
    savedAt: new Date(),
  });

  return documentRef.id;
}

export async function updateDocument(
  id: string,
  payload: UpdateDocumentInput,
): Promise<void> {
  const documentRef = doc(firestore, 'documents', id);
  await updateDoc(documentRef, {
    ...payload,
    savedAt: new Date(),
  });
}

export async function deleteDocumentById(id: string): Promise<void> {
  const documentRef = doc(firestore, 'documents', id);
  await deleteDoc(documentRef);
}
