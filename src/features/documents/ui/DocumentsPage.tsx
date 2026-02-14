import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getDocumentsByAuthor } from '../../../entities/documents/api/documents-api';
import type { DocumentRecord } from '../../../entities/documents/model/types';
import { getAuthSession } from '../../../shared/lib/auth-storage';
import { queryKeys } from '../../../shared/lib/query-keys';
import { LoaderSpinner } from '../../../shared/ui/LoaderSpinner';
import { DocumentCard } from './components/DocumentCard';
import { DocumentsSearchBar } from './components/DocumentsSearchBar';

export function DocumentsPage(): JSX.Element {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const session = getAuthSession();
  const username = session?.username ?? '';

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.documents(username),
    queryFn: () => getDocumentsByAuthor(username),
    enabled: Boolean(username),
  });

  const documents = data ?? [];

  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) return documents;

    const normalized = searchTerm.toLowerCase();
    return documents.filter((document) => document.title.toLowerCase().includes(normalized));
  }, [documents, searchTerm]);

  const openDocument = (document: DocumentRecord): void => {
    navigate(`/viewer/${document.id}`, { state: { document } });
  };

  return (
    <div className="flex h-full flex-col">
      <DocumentsSearchBar value={searchTerm} onChange={setSearchTerm} />

      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          {filteredDocuments.length === 0 ? (
            <div className="flex h-full items-center justify-center text-slate-400">No documents found.</div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} onOpen={openDocument} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
