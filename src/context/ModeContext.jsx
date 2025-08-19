import { createContext, useState } from "react";
const ModeContext = createContext();
export default ModeContext;

export function ModeProvider({ children }) {
  const [data, setData] = useState(null);
  return (
    <ModeContext.Provider value={{ data, setData }}>
      {children}
    </ModeContext.Provider>
  );
}
