import { createContext, useState } from "react";
const ModeContext = createContext();
export default ModeContext;

export function ModeProvider({ children }) {
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("");
  const [render, setRender] = useState(false);
  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        data,
        setData,
        title,
        setTitle,
        render,
        setRender,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}
