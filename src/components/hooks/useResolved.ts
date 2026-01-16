/**
 * Ink's `measureElement` function doesn't work with React's `use`
 * hook, so this project will use this hook instead.
 * It's also WAY faster
 */

import { useEffect, useState } from 'react';

export function useResolved<T>(
  asyncFn: () => Promise<T>,
  deps: any[] = []
): { value: T | undefined; resolved: boolean } {
  const [value, setValue] = useState<T | undefined>(undefined);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setResolved(false);
    setValue(undefined);

    asyncFn()
      .then((result) => {
        if (!cancelled) {
          setValue(result);
          setResolved(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResolved(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  return { value, resolved };
}
