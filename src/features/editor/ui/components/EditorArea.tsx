import { EditorContent, type Editor as TiptapEditor } from '@tiptap/react';

interface EditorAreaProps {
  editor: TiptapEditor;
}

export function EditorArea({ editor }: EditorAreaProps): JSX.Element {
  return (
    <div className="flex-1 overflow-y-auto rounded-b-2xl border border-t-0 border-slate-700 bg-slate-950/70 shadow-inner shadow-black/20">
      <EditorContent editor={editor} />
    </div>
  );
}
