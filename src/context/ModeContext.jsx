import { createContext, useState } from "react";
const ModeContext = createContext();
export default ModeContext;

export function ModeProvider({ children }) {
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("");
  return (
    <ModeContext.Provider
      value={{ mode, setMode, data, setData, title, setTitle }}
    >
      {children}
    </ModeContext.Provider>
  );
}
