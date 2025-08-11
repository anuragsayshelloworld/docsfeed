import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../../../../firebase.js";
import { saveToFirebase } from "../../../../firebase.js";
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
import { useState, useEffect } from "react";

export default function Editor() {
  const [, setRefresh] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const workSpace = useEditor({
    extensions: [StarterKit],
  });

  async function publish() {
    setIsPublishing(true);
    const content = workSpace.getHTML();
    await saveToFirebase(content);
    //a bit of error handling here later
    setIsPublishing(false);
  }

  useEffect(() => {
    if (!workSpace) return;

    const updateUI = () => setRefresh((r) => r + 1);
    workSpace.on("selectionUpdate", updateUI);
    workSpace.on("transaction", updateUI);

    return () => {
      workSpace.off("selectionUpdate", updateUI);
      workSpace.off("transaction", updateUI);
    };
  }, [workSpace]);

  const toolbarButtons = [
    {
      id: "bold",
      icon: Bold,
      action: () => workSpace.chain().focus().toggleBold().run(),
      isActive: () => workSpace.isActive("bold"),
    },
    {
      id: "italic",
      icon: Italic,
      action: () => workSpace.chain().focus().toggleItalic().run(),
      isActive: () => workSpace.isActive("italic"),
    },
    {
      id: "code",
      icon: Code,
      action: () => workSpace.chain().focus().toggleCode().run(),
      isActive: () => workSpace.isActive("code"),
    },
    { id: "separator" },
    {
      id: "h1",
      icon: Heading1,
      action: () => workSpace.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => workSpace.isActive("heading", { level: 1 }),
    },
    {
      id: "h2",
      icon: Heading2,
      action: () => workSpace.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => workSpace.isActive("heading", { level: 2 }),
    },
    { id: "separator" },
    {
      id: "ol",
      icon: ListOrdered,
      action: () => workSpace.chain().focus().toggleOrderedList().run(),
      isActive: () => workSpace.isActive("orderedList"),
    },
    {
      id: "ul",
      icon: List,
      action: () => workSpace.chain().focus().toggleBulletList().run(),
      isActive: () => workSpace.isActive("bulletList"),
    },
    { id: "link", icon: Link, action: () => {}, isActive: () => false },
    { id: "separator" },
    {
      id: "justify",
      icon: AlignJustify,
      action: () => {},
      isActive: () => false,
    },
  ];

  const getButtonClass = (isActive) =>
    `flex items-center justify-center w-9 h-9 rounded-md transition-colors duration-200 ${
      isActive
        ? "bg-gray-200 text-gray-900 shadow-sm border border-gray-300"
        : "text-gray-700 hover:bg-gray-100 border"
    }`;

  const renderButton = (button) => {
    if (button.id === "separator") {
      return <div key={Math.random()} className="w-px h-5 bg-gray-300 mx-2" />;
    }

    const Icon = button.icon;
    return (
      <button
        key={button.id}
        onClick={button.action}
        className={getButtonClass(button.isActive())}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  if (!workSpace) return null;

  return (
    <div className="w-full max-w-6xl mx-auto h-[93vh] flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-100 border border-gray-200 rounded-t-lg shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-3 border-b border-gray-200 gap-2">
          <div className="flex items-center gap-1">
            {toolbarButtons.map(renderButton)}
          </div>

          {/* Publish */}
          <button
            onClick={publish}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm rounded-md transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
            <span className="font-medium">
              {isPublishing ? "Publicing" : "Publish"}
            </span>
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
