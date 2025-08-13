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
  const [title, setTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(new Date());

  const workSpace = useEditor({
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setCharCount(text.length);
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      setLastSaved(new Date());
    },
  });

  async function publish() {
    setIsPublishing(true);
    try {
      const content = workSpace.getHTML();
      await saveToFirebase({ title, content });
      // Success handling here later
    } catch (error) {
      console.error("Publishing failed:", error);
      // Error handling here later
    } finally {
      setIsPublishing(false);
    }
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
      label: "Bold",
    },
    {
      id: "italic",
      icon: Italic,
      action: () => workSpace.chain().focus().toggleItalic().run(),
      isActive: () => workSpace.isActive("italic"),
      label: "Italic",
    },
    {
      id: "code",
      icon: Code,
      action: () => workSpace.chain().focus().toggleCode().run(),
      isActive: () => workSpace.isActive("code"),
      label: "Code",
    },
    { id: "separator" },
    {
      id: "h1",
      icon: Heading1,
      action: () => workSpace.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => workSpace.isActive("heading", { level: 1 }),
      label: "Heading 1",
    },
    {
      id: "h2",
      icon: Heading2,
      action: () => workSpace.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => workSpace.isActive("heading", { level: 2 }),
      label: "Heading 2",
    },
    { id: "separator" },
    {
      id: "ol",
      icon: ListOrdered,
      action: () => workSpace.chain().focus().toggleOrderedList().run(),
      isActive: () => workSpace.isActive("orderedList"),
      label: "Numbered List",
    },
    {
      id: "ul",
      icon: List,
      action: () => workSpace.chain().focus().toggleBulletList().run(),
      isActive: () => workSpace.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      id: "link",
      icon: Link,
      action: () => {},
      isActive: () => false,
      label: "Link",
    },
    { id: "separator" },
    {
      id: "justify",
      icon: AlignJustify,
      action: () => {},
      isActive: () => false,
      label: "Justify",
    },
  ];

  const getButtonClass = (isActive) =>
    `flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 ${
      isActive
        ? "bg-gray-200 text-gray-900 shadow-sm border border-gray-300"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200"
    }`;

  const renderButton = (button) => {
    if (button.id === "separator") {
      return <div key={Math.random()} className="w-px h-6 bg-gray-300 mx-2" />;
    }

    const Icon = button.icon;
    return (
      <button
        key={button.id}
        onClick={button.action}
        className={getButtonClass(button.isActive())}
        title={button.label}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setLastSaved(new Date());
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return "just now";
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return `${Math.floor(diffSecs / 86400)}d ago`;
  };

  if (!workSpace) return null;

  return (
    <div className="p-4 w-full max-w-6xl mx-auto h-[93vh] flex flex-col">
      {/* Title Section */}
      <div className="mb-3">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter document title..."
          className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent px-1 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 rounded-md transition-all duration-200"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 border border-gray-200 rounded-t-lg shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-3 border-b border-gray-200 gap-2">
          <div className="flex items-center gap-1">
            {toolbarButtons.map(renderButton)}
          </div>

          {/* Publish */}
          <button
            onClick={publish}
            disabled={isPublishing || (!title.trim() && wordCount === 0)}
            className={`flex items-center gap-2 px-4 py-2 text-white text-sm rounded-md transition-all duration-200 transform hover:scale-105 ${
              isPublishing
                ? "bg-gray-500 cursor-not-allowed scale-100"
                : !title.trim() && wordCount === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-900 shadow-md hover:shadow-lg"
            }`}
          >
            <Send
              className={`w-4 h-4 ${isPublishing ? "animate-pulse" : ""}`}
            />
            <span className="font-medium">
              {isPublishing ? "Publishing..." : "Publish"}
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable editor area */}
      <div className="flex-1 overflow-y-auto bg-white border-x border-gray-200 shadow-inner">
        <EditorContent editor={workSpace} />
      </div>

      {/* Enhanced Status bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-b-lg border border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-medium">Words: {wordCount}</span>
          <span className="text-gray-400">•</span>
          <span className="font-medium">Characters: {charCount}</span>
          {title && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">Title: {title.length} chars</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">
              Auto-saved
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Last saved: {formatTimeAgo(lastSaved)}
          </span>
        </div>
      </div>
    </div>
  );
}
