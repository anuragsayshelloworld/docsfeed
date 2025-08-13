import { EditorContent } from "@tiptap/react";
export default function EditorContentWrapper({ workSpace }) {
  return (
    <div className="flex-1 overflow-y-auto bg-white border-x border-gray-200 shadow-inner">
      <EditorContent editor={workSpace} />
    </div>
  );
}
