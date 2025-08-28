import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../../../../firebase.js";
import { saveToFirebase } from "../../../../firebase.js";
import EditorToolbar from "./editor-components/Toolbar.jsx";
import TitleInput from "./editor-components/TitleInput.jsx";
import "../../../../css/editor.css";
import { useState, useEffect, useContext } from "react";
import EditorContentWrapper from "./editor-components/EditorArea.jsx";
import ModeContext from "../../../../context/ModeContext.jsx";

export default function Editor() {
  const { data, title: contextTitle, mode } = useContext(ModeContext);
  const [, setRefresh] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const workSpace = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    },
  });

  async function publish() {
    setIsPublishing(true);
    try {
      const content = workSpace.getHTML();
      await saveToFirebase({ Title: currentTitle, content });
      // Success handling here later
    } catch (error) {
      console.error("Publishing failed:", error);
      // Error handling here later
    } finally {
      setIsPublishing(false);
    }
  }

  async function update() {
    console.log("Update function called");
    // Update logic here later
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

  useEffect(() => {
    // Only bind title if in edit mode
    if (mode === "edit" && contextTitle) {
      setCurrentTitle(contextTitle);
    } else {
      setCurrentTitle(""); // Fresh start for create mode
    }
  }, [mode, contextTitle]);

  useEffect(() => {
    // Only bind content if in edit mode
    if (mode === "edit" && workSpace && data) {
      workSpace.commands.setContent(data);
    } else if (workSpace) {
      workSpace.commands.setContent(""); // Fresh start for create mode
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
