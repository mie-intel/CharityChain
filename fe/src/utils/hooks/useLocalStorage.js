"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to manage local storage with optional revalidation.
 *
 * @param {string} key - The key to store and retrieve the value in local storage.
 * @param {*} initialValue - The initial value to use if no value is found in local storage.
 * @param {number} [revalidate=-1] - Optional revalidation interval in seconds. Defaults to -1 (no revalidation).
 * @returns {[*, Function]} - Returns the current value and a setter function to update the value.
 *
 * @example
 * const [value, setValue] = useLocalStorage('myKey', 'defaultValue');
 * setValue('newValue');
 */

export const useLocalStorage = (key, initialValue, revalidate = -1) => {
  const [currentValue, setCurrentValue] = useState(null);

  const setLocalStorage = (value) => {
    const currentDate = Date.now();
    window.localStorage.setItem(
      key,
      JSON.stringify({
        date: currentDate,
        value: value,
      }),
    );
    setCurrentValue(value);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      const item = window.localStorage.getItem(key);
      const currentDate = Date.now();
      if (!item) {
        setLocalStorage(initialValue);
      } else {
        const parsedItem = JSON.parse(item); // cek if item need to be revalidated
        if (revalidate !== -1 && currentDate - item.date >= revalidate * 1000) {
          setLocalStorage(initialValue);
        } else {
          setCurrentValue(parsedItem.value);
        }
      }
    }
  }, [key]);

  return [currentValue, setLocalStorage];
};
