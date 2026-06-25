import { useEffect, useState } from 'react';

export function useLocalStorage<T>(name: string): [T | null, (value: T | null) => void] {
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new Error('useLocalStorage accepts only strings');
  }

  // Get the item from localStorage and parse it, defaulting to null
  const storedValue = localStorage.getItem(name);
  const initialValue = storedValue ? (JSON.parse(storedValue) as T) : null;

  const [value, setValue] = useState<T | null>(initialValue);

  useEffect(() => {
    if (value !== null) {
      localStorage.setItem(name, JSON.stringify(value));
    } else {
      localStorage.removeItem(name);
    }
  }, [name, value]);

  return [value, setValue];
}
