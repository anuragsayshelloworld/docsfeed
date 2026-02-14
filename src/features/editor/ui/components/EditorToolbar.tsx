import type { Editor as TiptapEditor } from '@tiptap/react';
import {
  Bold,
  Code,
  FileCode,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Send,
  Undo2,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: TiptapEditor;
  isPublishing: boolean;
  title: string;
  wordCount: number;
  isEditing: boolean;
  onPublish: () => void;
}

interface ToolbarButton {
  id: string;
  label: string;
  isSeparator?: boolean;
  isActive?: () => boolean;
  isDisabled?: () => boolean;
  action?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EditorToolbar({
  editor,
  isPublishing,
  title,
  wordCount,
  isEditing,
  onPublish,
}: EditorToolbarProps): JSX.Element {
  const codeLanguages = [
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'JSON', value: 'json' },
    { label: 'HTML', value: 'xml' },
    { label: 'CSS', value: 'css' },
    { label: 'Bash', value: 'bash' },
    { label: 'Python', value: 'python' },
    { label: 'Plain Text', value: 'plaintext' },
  ];

  const isCodeBlockActive = editor.isActive('codeBlock');
  const activeCodeLanguage =
    (editor.getAttributes('codeBlock').language as string | undefined) ?? 'typescript';

  const toolbarButtons: ToolbarButton[] = [
    {
      id: 'undo',
      label: 'Undo',
      icon: Undo2,
      action: () => editor.chain().focus().undo().run(),
      isDisabled: () => !editor.can().chain().focus().undo().run(),
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: Redo2,
      action: () => editor.chain().focus().redo().run(),
      isDisabled: () => !editor.can().chain().focus().redo().run(),
    },
    { id: 'separator-undo', label: 'separator', isSeparator: true },
    {
      id: 'bold',
      label: 'Bold',
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      id: 'italic',
      label: 'Italic',
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      id: 'code',
      label: 'Inline Code',
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
    },
    {
      id: 'codeBlock',
      label: 'Code Block',
      icon: FileCode,
      action: () =>
        editor
          .chain()
          .focus()
          .toggleCodeBlock({ language: activeCodeLanguage || 'typescript' })
          .run(),
      isActive: () => editor.isActive('codeBlock'),
    },
    { id: 'separator-content', label: 'separator', isSeparator: true },
    {
      id: 'heading-1',
      label: 'Heading 1',
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      id: 'heading-2',
      label: 'Heading 2',
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    { id: 'separator-2', label: 'separator', isSeparator: true },
    {
      id: 'ordered-list',
      label: 'Ordered List',
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      id: 'bullet-list',
      label: 'Bullet List',
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      id: 'blockquote',
      label: 'Blockquote',
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
  ];

  const publishDisabled = isPublishing || !title.trim() || wordCount === 0;

  return (
    <div className="overflow-hidden rounded-t-lg border border-slate-700 bg-slate-900/80 shadow-lg shadow-black/20">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 p-3">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button) => {
            if (button.isSeparator) {
              return <div key={button.id} className="mx-2 h-6 w-px bg-slate-700" />;
            }

            const Icon = button.icon;
            const active = button.isActive?.() ?? false;
            const disabled = button.isDisabled?.() ?? false;

            return (
              <button
                key={button.id}
                type="button"
                onClick={button.action}
                title={button.label}
                disabled={disabled}
                className={`flex h-9 w-9 items-center justify-center rounded-md border transition-all duration-200 ${
                  disabled
                    ? 'cursor-not-allowed border-transparent text-slate-600'
                    : ''
                } ${
                  active
                    ? 'border-cyan-500/50 bg-slate-800 text-cyan-200 shadow-sm'
                    : 'border-transparent text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeCodeLanguage}
            disabled={!isCodeBlockActive}
            onChange={(event) => {
              editor
                .chain()
                .focus()
                .updateAttributes('codeBlock', { language: event.target.value })
                .run();
            }}
            className="h-9 rounded-md border border-slate-700 bg-slate-950 px-2 text-xs text-slate-200 outline-none transition-colors focus:border-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-900 disabled:text-slate-500"
          >
            {codeLanguages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>

          <div className="hidden rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-medium text-slate-400 md:block">
            {wordCount} words
          </div>

          <button
            type="button"
            onClick={onPublish}
            disabled={publishDisabled}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              publishDisabled
                ? 'cursor-not-allowed bg-slate-700 text-slate-400'
                : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:scale-105 hover:bg-cyan-400'
            }`}
          >
            <Send className={`h-4 w-4 ${isPublishing ? 'animate-pulse' : ''}`} />
            <span>
              {isPublishing ? (isEditing ? 'Updating...' : 'Publishing...') : isEditing ? 'Update' : 'Publish'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
