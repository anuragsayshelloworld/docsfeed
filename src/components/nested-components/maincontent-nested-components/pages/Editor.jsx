import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../../../../firebase.js";
import { saveToFirebase, updateDocument } from "../../../../firebase.js";
import EditorToolbar from "./editor-components/Toolbar.jsx";
import TitleInput from "./editor-components/TitleInput.jsx";
import "../../../../css/editor.css";
import { useState, useEffect, useContext } from "react";
import EditorContentWrapper from "./editor-components/EditorArea.jsx";
import ModeContext from "../../../../context/ModeContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";

// Simple notification component
function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "error"
      ? "bg-red-100 border-red-400 text-red-700"
      : "bg-yellow-100 border-yellow-400 text-yellow-700";

  return (
    <div
      className={`fixed top-4 right-4 p-3 border rounded shadow-lg z-50 ${bgColor}`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-3 text-lg">
          &times;
        </button>
      </div>
    </div>
  );
}

export default function Editor() {
  const documentId = useLocation().state;
  const navigate = useNavigate();
  const { data, title: contextTitle, mode, setMode } = useContext(ModeContext);
  const [, setRefresh] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(
    mode === "edit" ? contextTitle : ""
  );
  const [wordCount, setWordCount] = useState(0);
  const [notification, setNotification] = useState(null);

  const workSpace = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    },
  });

  const showNotification = (message, type = "warning") => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (mode === "edit") {
      setCurrentTitle(contextTitle || "");
    } else {
      setCurrentTitle("");
    }
  }, [mode, contextTitle]);

  async function publish() {
    if (!currentTitle.trim() || wordCount === 0) {
      showNotification("⚠️ Cannot publish empty document.");
      return;
    }

    setIsPublishing(true);
    try {
      const content = workSpace.getHTML();
      await saveToFirebase({ title: currentTitle, html: content });
      navigate("/");
    } catch (error) {
      console.error("Publishing failed:", error);
      showNotification("❌ Failed to publish. Please try again.", "error");
    } finally {
      setIsPublishing(false);
    }
  }

  async function update() {
    if (!currentTitle.trim() || wordCount === 0) {
      showNotification("⚠️ Cannot update empty document.");
      return;
    }

    setIsPublishing(true);
    if (!documentId) return;

    try {
      const content = workSpace.getHTML();
      await updateDocument(documentId, {
        title: currentTitle,
        html: content,
      });
      navigate("/");
    } catch (error) {
      console.error("Update failed:", error);
      showNotification("❌ Failed to update. Please try again.", "error");
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

  // dont touch this useEffect! never! its a petty hack!
  useEffect(() => {
    return () => {
      if (!window.location.pathname.includes("/editor/edit")) {
        setMode("");
      }
    };
  }, [setMode]);

  // Load existing content only in edit mode
  useEffect(() => {
    if (!workSpace) return;

    if (mode === "edit" && data) {
      workSpace.commands.setContent(data);
    } else {
      workSpace.commands.setContent(""); // fresh start
    }
  }, [mode, data, workSpace]);

  const handleTitleChange = (e) => {
    setCurrentTitle(e.target.value);
  };

  if (!workSpace) return null;

  return (
    <div className="p-4 w-full max-w-6xl mx-auto h-[93vh] flex flex-col">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <TitleInput title={currentTitle} onTitleChange={handleTitleChange} />

      <EditorToolbar
        data={data}
        workSpace={workSpace}
        onPublish={mode === "edit" ? update : publish}
        isPublishing={isPublishing}
        title={currentTitle}
        wordCount={wordCount}
        mode={mode}
      />

      <EditorContentWrapper workSpace={workSpace} />
    </div>
  );
}
