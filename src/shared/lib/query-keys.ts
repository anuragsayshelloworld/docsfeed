export const queryKeys = {
  documentsRoot: ['documents'] as const,
  documents: (author: string) => ['documents', author] as const,
  document: (id: string) => ['document', id] as const,
};
