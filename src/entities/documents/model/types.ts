import type { Timestamp } from 'firebase/firestore';

export interface DocumentRecord {
  id: string;
  title: string;
  html: string;
  author: string;
  savedAt?: Timestamp | Date | string | null;
}

export interface CreateDocumentInput {
  title: string;
  html: string;
  author: string;
}

export interface UpdateDocumentInput {
  title: string;
  html: string;
}
