import { useMemo, useState } from 'react';
import parse, { Element, type DOMNode } from 'html-react-parser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, FileText, Trash2 } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  deleteDocumentById,
  getDocumentById,
} from '../../../entities/documents/api/documents-api';
import type { DocumentRecord } from '../../../entities/documents/model/types';
import { getAuthSession } from '../../../shared/lib/auth-storage';
import { queryKeys } from '../../../shared/lib/query-keys';
import { LoaderSpinner } from '../../../shared/ui/LoaderSpinner';
import { useUiStore } from '../../../store/ui-store';
import { CodeBlock } from './components/CodeBlock';
import '../../../css/viewer.css';

interface ViewerLocationState {
  document?: DocumentRecord;
}

function extractCodeNode(node: Element): string {
  const codeNode = node.children.find(
    (child): child is Element => child instanceof Element && child.name === 'code',
  );

  if (!codeNode || !codeNode.children[0] || !('data' in codeNode.children[0])) {
    return '';
  }

  return String(codeNode.children[0].data ?? '');
}

export function DocumentViewerPage(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id = '' } = useParams();
  const { state } = useLocation() as { state: ViewerLocationState | null };

  const session = getAuthSession();
  const startEditingDocument = useUiStore((store) => store.startEditingDocument);

  const initialDocument = state?.document;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.document(id),
    queryFn: () => getDocumentById(id),
    enabled: Boolean(id),
    initialData: initialDocument,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocumentById(documentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.documentsRoot });
      await queryClient.invalidateQueries({ queryKey: queryKeys.document(id) });
      navigate('/');
    },
  });

  const canMutate = useMemo(() => {
    if (!session || !data) return false;
    return session.role === 1 || session.username === data.author;
  }, [session, data]);

  const onEdit = (): void => {
    if (!data) return;

    startEditingDocument(data);
    navigate(`/editor/${data.id}`);
  };

  const onDelete = (): void => {
    if (!data) return;
    deleteMutation.mutate(data.id);
  };

  const renderTransform = (node: DOMNode): JSX.Element | undefined => {
    if (node instanceof Element && node.name === 'pre') {
      const code = extractCodeNode(node);
      return <CodeBlock code={code} />;
    }

    return undefined;
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-slate-400">
        <FileText className="h-8 w-8 text-slate-500" />
        <h2 className="text-lg font-semibold text-slate-200">Document not found</h2>
        <p>The document was deleted or does not exist.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 p-4 shadow-lg shadow-black/20 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 transition-colors hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
      </div>

      <div className="flex flex-1 justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-100">{data.title}</h1>
            {canMutate ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-300 transition-colors hover:text-cyan-200"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-rose-300 transition-colors hover:text-rose-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            ) : null}
          </div>

          <div className="innerDoc">{parse(data.html, { replace: renderTransform })}</div>
        </div>
      </div>

      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70">
          <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/40">
            <h3 className="mb-4 text-lg font-semibold text-slate-100">Delete document</h3>
            <p className="mb-6 text-sm text-slate-400">
              This action cannot be undone. Delete "{data.title}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-slate-300 transition-colors hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={deleteMutation.isPending}
                className="rounded bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-rose-300"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
