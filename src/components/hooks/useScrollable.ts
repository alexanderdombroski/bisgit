import { useEffect, useState } from 'react';

type ScrollableListControls<T> = {
  scrollUp: () => void;
  scrollDown: () => void;
  outList: T[];
  selectedValue: T | undefined;
  selectedIndex: number;
};

export function useScrollable<T>(items: T[], outputLength: number): ScrollableListControls<T> {
  const [offset, setOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setOffset(0);
    setSelectedIndex(0);
  }, [items]);

  const maxOffset = Math.max(0, items.length - outputLength);
  const maxIndex = items.length - 1;

  const scrollDown = () => {
    setSelectedIndex((prev) => {
      const next = Math.min(prev + 1, maxIndex);

      setOffset((offset) =>
        next >= offset + outputLength ? Math.min(offset + 1, maxOffset) : offset
      );

      return next;
    });
  };

  const scrollUp = () => {
    setSelectedIndex((prev) => {
      const next = Math.max(prev - 1, 0);

      setOffset((offset) => (next < offset ? Math.max(offset - 1, 0) : offset));

      return next;
    });
  };

  const outList = items.slice(offset, offset + outputLength);
  const selectedValue = items[selectedIndex];

  return {
    scrollDown,
    scrollUp,
    outList,
    selectedIndex,
    selectedValue,
  };
}
