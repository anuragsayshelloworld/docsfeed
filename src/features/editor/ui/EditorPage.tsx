import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEditor } from '@tiptap/react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import plaintext from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { createLowlight } from 'lowlight';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createDocument,
  getDocumentById,
  updateDocument,
} from '../../../entities/documents/api/documents-api';
import { getAuthSession } from '../../../shared/lib/auth-storage';
import { queryKeys } from '../../../shared/lib/query-keys';
import { useUiStore } from '../../../store/ui-store';
import { EditorArea } from './components/EditorArea';
import { EditorToolbar } from './components/EditorToolbar';
import { TitleInput } from './components/TitleInput';
import '../../../css/editor.css';

const lowlight = createLowlight();

lowlight.register({
  bash,
  css,
  javascript,
  json,
  plaintext,
  python,
  typescript,
  xml,
});

interface NotificationState {
  type: 'warning' | 'error';
  message: string;
}

function Notification({
  notification,
  onClose,
}: {
  notification: NotificationState;
  onClose: () => void;
}): JSX.Element {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed right-4 top-4 z-50 rounded border p-3 shadow-lg ${
        notification.type === 'error'
          ? 'border-rose-400/60 bg-rose-500/10 text-rose-100'
          : 'border-amber-300/60 bg-amber-500/10 text-amber-100'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span>{notification.message}</span>
        <button type="button" onClick={onClose} className="text-lg leading-none text-slate-200">
          x
        </button>
      </div>
    </div>
  );
}

export function EditorPage(): JSX.Element | null {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const session = getAuthSession();
  const startCreateDocument = useUiStore((store) => store.startCreateDocument);
  const startEditingDocument = useUiStore((store) => store.startEditingDocument);

  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const activeDocumentId = id ?? null;

  const { data: remoteDocument } = useQuery({
    queryKey: queryKeys.document(activeDocumentId ?? ''),
    queryFn: () => getDocumentById(activeDocumentId as string),
    enabled: Boolean(activeDocumentId),
  });

  const isEditing = useMemo(() => Boolean(activeDocumentId), [activeDocumentId]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'typescript',
        enableTabIndentation: true,
        tabSize: 2,
        exitOnArrowDown: false,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Title your section...';
          }

          return 'Write documentation, or insert a code block for snippets.';
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        spellcheck: 'false',
        autocapitalize: 'off',
        autocomplete: 'off',
        autocorrect: 'off',
      },
    },
    onUpdate: ({ editor: workspace }) => {
      const text = workspace.getText();
      const nextWordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(nextWordCount);
    },
  });

  useEffect(() => {
    if (!editor || activeDocumentId) return;

    editor.commands.setContent('');
    setTitle('');
    setWordCount(0);

    const cachedState = useUiStore.getState().editor;
    const hasCachedDraft =
      cachedState.documentId !== null ||
      cachedState.title.length > 0 ||
      cachedState.html.length > 0;

    if (hasCachedDraft) {
      startCreateDocument();
    }
  }, [editor, activeDocumentId, startCreateDocument]);

  useEffect(() => {
    if (!editor || !activeDocumentId) return;

    const cachedState = useUiStore.getState().editor;
    if (cachedState.documentId === activeDocumentId && cachedState.html) {
      editor.commands.setContent(cachedState.html);
      setTitle(cachedState.title);
      return;
    }

    if (remoteDocument) {
      editor.commands.setContent(remoteDocument.html ?? '');
      setTitle(remoteDocument.title ?? '');
      startEditingDocument(remoteDocument);
    }
  }, [editor, activeDocumentId, remoteDocument, startEditingDocument]);

  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.documentsRoot });
      startCreateDocument();
      navigate('/');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ documentId, nextTitle, html }: { documentId: string; nextTitle: string; html: string }) =>
      updateDocument(documentId, {
        title: nextTitle,
        html,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.documentsRoot });
      if (activeDocumentId) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.document(activeDocumentId) });
      }
      startCreateDocument();
      navigate('/');
    },
  });

  const isPublishing = createMutation.isPending || updateMutation.isPending;

  const showNotification = (message: string, type: NotificationState['type'] = 'warning'): void => {
    setNotification({ message, type });
  };

  const publish = (): void => {
    if (!editor) return;

    if (!title.trim() || wordCount === 0) {
      showNotification('Cannot publish empty document.');
      return;
    }

    if (!session?.username) {
      showNotification('Session expired. Please log in again.', 'error');
      navigate('/login');
      return;
    }

    const html = editor.getHTML();

    if (activeDocumentId) {
      updateMutation.mutate({
        documentId: activeDocumentId,
        nextTitle: title,
        html,
      });
      return;
    }

    createMutation.mutate({
      title,
      html,
      author: session.username,
    });
  };

  if (!editor) return null;

  return (
    <section className="h-full overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_rgba(15,23,42,0.8)_35%,_rgba(2,6,23,0.96)_100%)] p-4 md:p-6">
      <div className="mx-auto flex h-[calc(100vh-7.2rem)] w-full max-w-6xl flex-col rounded-2xl border border-slate-700 bg-slate-900/75 p-4 shadow-2xl shadow-black/35 backdrop-blur md:p-5">
        {notification ? (
          <Notification notification={notification} onClose={() => setNotification(null)} />
        ) : null}

        <TitleInput value={title} onChange={setTitle} />

        <EditorToolbar
          editor={editor}
          onPublish={publish}
          isPublishing={isPublishing}
          title={title}
          wordCount={wordCount}
          isEditing={isEditing}
        />

        <EditorArea editor={editor} />
      </div>
    </section>
  );
}
