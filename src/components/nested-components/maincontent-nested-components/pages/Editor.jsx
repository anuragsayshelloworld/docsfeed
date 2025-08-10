import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Link,
  Send,
  Heading1,
  Heading2,
  AlignJustify,
} from "lucide-react";
import "../../../../css/editor.css";

export default function Editor() {
  const workSpace = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing something amazing...</p>",
  });

  if (!workSpace) return null;

  return (
    <div className="w-full max-w-6xl mx-auto h-[95vh] flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-100 border border-gray-200 rounded-t-lg shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-3 border-b border-gray-200 gap-2">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-9 h-9 rounded-md text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <Bold className="w-4 h-4" />
            </button>

            <button className="flex items-center justify-center w-9 h-9 rounded-md text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <Italic className="w-4 h-4" />
            </button>

            <button className="flex items-center justify-center w-9 h-9 rounded-md text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <Code className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-300 mx-2"></div>

            <button className="flex items-center justify-center w-9 h-9 rounded-md text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <Heading1 className="w-4 h-4" />
            </button>

            <button className="flex items-center justify-center w-9 h-9 rounded-md text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <Heading2 className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-300 mx-2"></div>

            <button className="flex items-center justify-center w-9 h-9 rounded-md text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <ListOrdered className="w-4 h-4" />
            </button>

            <button className="flex items-center justify-center w-9 h-9 rounded-md text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <List className="w-4 h-4" />
            </button>

            <button className="flex items-center justify-center w-9 h-9 rounded-md text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <Link className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-gray-300 mx-2"></div>

            <button className="flex items-center justify-center w-9 h-9 rounded-md text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm rounded-md transition-colors duration-200">
            <Send className="w-4 h-4" />
            <span className="font-medium">Publish</span>
          </button>
        </div>
      </div>

      {/* Scrollable editor area */}
      <div className="flex-1 overflow-y-auto bg-white border-x border-gray-200">
        <EditorContent editor={workSpace} />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-b-lg border border-gray-200">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>Words: 0</span>
          <span>•</span>
          <span>Characters: 0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Saved</span>
        </div>
      </div>
    </div>
  );
}
