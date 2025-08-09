import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor() {
  const workSpace = useEditor({
    extensions: [StarterKit],
  });
  if (!workSpace) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <p>Here will be the editor!</p>
      <EditorContent editor={workSpace} className="border p-2" />
    </div>
  );
}
