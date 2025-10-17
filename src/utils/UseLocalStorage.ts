import { useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T, reviver?: (value: string) => T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);

    if (reviver) {
      return item ? reviver(item) : initialValue;
    } else {
      return item ? JSON.parse(item) as T : initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}
