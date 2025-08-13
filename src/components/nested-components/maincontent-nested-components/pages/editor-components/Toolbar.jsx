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
  FileCode,
} from "lucide-react";
export default function EditorToolbar({
  workSpace,
  onPublish,
  isPublishing,
  title,
  wordCount,
}) {
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
    {
      id: "codeBlock",
      icon: FileCode,
      action: () => workSpace.chain().focus().toggleCodeBlock().run(),
      isActive: () => workSpace.isActive("codeBlock"),
      label: "codeBlock",
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

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-t-lg shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-gray-200 gap-2">
        <div className="flex items-center gap-1">
          {toolbarButtons.map(renderButton)}
        </div>

        {/* Publish Button */}
        <button
          onClick={onPublish}
          disabled={isPublishing || (!title.trim() && wordCount === 0)}
          className={`flex items-center gap-2 px-4 py-2 text-white text-sm rounded-md transition-all duration-200 transform hover:scale-105 ${
            isPublishing
              ? "bg-gray-500 cursor-not-allowed scale-100"
              : !title.trim() && wordCount === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-900 shadow-md hover:shadow-lg"
          }`}
        >
          <Send className={`w-4 h-4 ${isPublishing ? "animate-pulse" : ""}`} />
          <span className="font-medium">
            {isPublishing ? "Publishing..." : "Publish"}
          </span>
        </button>
      </div>
    </div>
  );
}
