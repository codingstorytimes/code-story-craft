import { Store } from "@/common/store";
import { useState, useEffect, useMemo, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (v: T | ((prev: T) => T)) => void] {
  // Create the store once per key/defaultValue
  const store = useMemo(
    () => new Store({ key, defaults: { value: defaultValue } }),
    [key, defaultValue]
  );

  // Initialize state from store
  const [value, setValue] = useState<T>(() => store.load().value);

  // Function to update both state and store immediately
  const setStoredValue = useCallback(
    (update: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const newValue = update instanceof Function ? update(prev) : update;
        store.save({ value: newValue }); // Save immediately to store
        return newValue;
      });
    },
    [store]
  );

  // Optional: sync state to store if store changes externally
  useEffect(() => {
    store.save({ value });
  }, [store, value]);

  return [value, setStoredValue];
}
