import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      console.log(`Reading initial ${key} from localStorage`);
      const item = window.localStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;
      console.log(`Initial ${key} value:`, value);
      return value;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      console.log(`Setting ${key} to:`, value);
      // Allow value to be a function
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      console.log(`Saved ${key} to localStorage:`, valueToStore);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Subscribe to changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        console.log(`${key} changed in another window:`, event.newValue);
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}