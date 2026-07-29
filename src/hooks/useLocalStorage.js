// Hook para sincronizar estado com LocalStorage
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../services/storage';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return storage.get(key, initialValue);
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.set(key, valueToStore);
    } catch (error) {
      console.error(`useLocalStorage setValue error:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
