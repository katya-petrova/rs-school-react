import { useState, useEffect } from 'react';

export const useLocalStorage = (
  key: string,
  initialValue: string
): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [storedValue, setStoredValue] = useState<string>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log('Local storage error:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log('Local storage error:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
