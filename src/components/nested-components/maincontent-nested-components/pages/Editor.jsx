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

  const workSpace = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    },
  });

  // ✅ Keep currentTitle in sync with context
  useEffect(() => {
    if (mode === "edit") {
      setCurrentTitle(contextTitle || "");
    } else {
      setCurrentTitle("");
    }
  }, [mode, contextTitle]);

  async function publish() {
    setIsPublishing(true);
    try {
      const content = workSpace.getHTML();
      await saveToFirebase({ title: currentTitle, html: content }); // ✅ unified schema
      navigate("/");
    } catch (error) {
      console.error("Publishing failed:", error);
    } finally {
      setIsPublishing(false);
    }
  }

  async function update() {
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
