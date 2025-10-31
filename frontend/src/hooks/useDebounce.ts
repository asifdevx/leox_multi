import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay = 500): T => {
  const [debounce, setDebounce] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounce(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounce;
};
