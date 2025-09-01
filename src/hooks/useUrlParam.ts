import { useState, useEffect } from "react";

/**
 * Custom hook to manage a URL search parameter
 * @param key - The search parameter key
 * @param defaultValue - Default value if the parameter doesn't exist
 * @returns [value, setValue] - Current value and function to update it
 */
export function useUrlParam<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return (urlParams.get(key) as T) || defaultValue;
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, value);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [key, value]);

  return [value, setValue];
}
