import { create } from 'zustand';
import type { DocumentRecord } from '../entities/documents/model/types';

type EditorMode = 'create' | 'edit';

interface EditorState {
  mode: EditorMode;
  documentId: string | null;
  title: string;
  html: string;
}

interface UiStore {
  sidebarSearch: string;
  editor: EditorState;
  setSidebarSearch: (value: string) => void;
  startCreateDocument: () => void;
  startEditingDocument: (document: Pick<DocumentRecord, 'id' | 'title' | 'html'>) => void;
}

const getDefaultEditorState = (): EditorState => ({
  mode: 'create',
  documentId: null,
  title: '',
  html: '',
});

export const useUiStore = create<UiStore>((set) => ({
  sidebarSearch: '',
  editor: getDefaultEditorState(),
  setSidebarSearch: (value) => set({ sidebarSearch: value }),
  startCreateDocument: () => set({ editor: getDefaultEditorState() }),
  startEditingDocument: (document) =>
    set({
      editor: {
        mode: 'edit',
        documentId: document.id,
        title: document.title,
        html: document.html,
      },
    }),
}));
