import { useState, useCallback } from "react";

function useLocalStorage(key) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  });

  const get = useCallback(() => {
    const item = localStorage.getItem(key);
    const data = item ? JSON.parse(item) : null;
    setValue(data);
    return data;
  }, [key]);

  const set = useCallback(
    (data) => {
      localStorage.setItem(key, JSON.stringify(data));
      setValue(data);
      return data;
    },
    [key]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(null);
    return null;
  }, [key]);

  // Return object with mode functions
  return {
    value,
    get,
    set,
    remove,
  };
}

export default useLocalStorage;
