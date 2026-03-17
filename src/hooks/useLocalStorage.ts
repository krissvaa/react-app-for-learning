import { useState, useCallback } from 'react';

// LEARNING NOTE: Custom hooks extract reusable logic from components.
// This hook wraps localStorage with:
//  - Type safety (generics)
//  - Error handling (private browsing, storage full, corrupted data)
//  - A useState-like API: const [value, setValue, removeValue] = useLocalStorage(key, default)
//
// In enterprise apps, localStorage can fail in ways you don't expect:
//  - Safari private browsing throws on setItem
//  - Storage can be full (5MB limit)
//  - Another tab can corrupt the JSON
//  - SSR environments have no localStorage at all

function useLocalStorage<T>(key: string, initialValue: T) {
  // Lazy initializer — reads localStorage once on mount
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      // JSON parse failed or localStorage unavailable
      return initialValue;
    }
  });

  // Wrapped setter — updates both state and localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // Storage full or private browsing — state still updates
          console.warn(`useLocalStorage: failed to write key "${key}"`);
        }
        return nextValue;
      });
    },
    [key],
  );

  // Remove the key entirely
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

export default useLocalStorage;
