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
  const { data } = useContext(ModeContext);
  const [, setRefresh] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [title, setTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const workSpace = useEditor({
    extensions: [StarterKit],
    content: data || "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
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

  useEffect(() => {
    //worsSpace.getHttml le current html content bhitra j chha tyo dinchha..
    // compares with new data or "" (its always null via context)
    if (workSpace && workSpace.getHTML() !== (data || "")) {
      workSpace.commands.setContent(data || "");
    }
  }, [data, workSpace]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  if (!workSpace) return null;

  return (
    <div className="p-4 w-full max-w-6xl mx-auto h-[93vh] flex flex-col">
      <TitleInput title={title} onTitleChange={handleTitleChange} />

      <EditorToolbar
        data={data}
        workSpace={workSpace}
        onPublish={publish}
        isPublishing={isPublishing}
        title={title}
        wordCount={wordCount}
      />

      <EditorContentWrapper workSpace={workSpace} />
    </div>
  );
}
