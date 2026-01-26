import { useEffect, useRef, useState } from 'react';

type ScrollableListControls<T> = {
  scrollUp: () => void;
  scrollDown: () => void;
  outList: T[];
  selectedValue: T | undefined;
  selectedIndex: number;
  renderedIndex: number;
  refresh: () => void;
};

export function useScrollable<T>(items: T[], outputLength: number): ScrollableListControls<T> {
  const [offset, setOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lastSelectedValueRef = useRef<T>(undefined);
  const [id, setId] = useState(0);
  const refresh = () => setId((prev) => prev + 1);

  // Determine which item to select when items change
  useEffect(() => {
    let newIndex = 0;
    if (lastSelectedValueRef.current !== undefined) {
      const foundIndex = items.findIndex((item) => item === lastSelectedValueRef.current);
      if (foundIndex >= 0) newIndex = foundIndex;
    }

    setSelectedIndex(newIndex);
    const newOffset = Math.min(
      Math.max(newIndex - Math.floor(outputLength / 2), 0),
      Math.max(0, items.length - outputLength)
    );
    setOffset(newOffset);
  }, [items, outputLength, id]);

  // Update last selected value every time
  useEffect(() => {
    lastSelectedValueRef.current = items[selectedIndex];
  }, [selectedIndex, items]);

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
    renderedIndex: selectedIndex - offset,
    selectedValue,
    refresh,
  };
}
