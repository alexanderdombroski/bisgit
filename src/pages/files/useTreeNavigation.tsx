import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { useResolved } from '../../components/hooks/useResolved';
import { useDimensions } from '../../components/hooks/useDimensions';
import { useInput } from 'ink';
import { useNav } from '../../components/navigation';
import { flattenTree, getFileTree, type Tree } from '../../utils/fs';

type TreeNavigationType = {
  visibleParts: Set<string>;
  visibleTreeItems: Set<string>;
  selectedFile?: string;
  tree?: Tree;
  refresh: () => void;
  /** Added to root of tree for refresh */
  visibilityVersion: number;
};

const TreeNavigation = createContext({} as TreeNavigationType);

export function TreeNavigationProvder({ children }: PropsWithChildren) {
  const { value: tree, resolved } = useResolved(getFileTree);
  const { sectionHeight } = useDimensions();
  const { activeSection } = useNav();
  const outputLength = sectionHeight - 3;

  const [visibilityVersion, setVisibilityVersion] = useState(0);
  const refresh = () => setVisibilityVersion((prev) => prev + 1);

  const visibleParts = useMemo(() => new Set<string>(Object.keys(tree ?? {})), [tree]);

  const selectableList = useMemo(() => {
    if (!tree) return [];
    const files = flattenTree(tree);
    return files.filter((fp) => visibleParts.has(fp)) ?? [];
  }, [visibleParts.size, tree, visibilityVersion]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedValue = selectableList[selectedIndex];
  const lastPathRef = useRef<string>(selectedValue);

  useEffect(() => {
    if (lastPathRef.current) {
      const newIndex = selectableList.indexOf(lastPathRef.current);
      if (newIndex !== -1) {
        setSelectedIndex(newIndex);
      }
    }
  }, [selectableList]);

  const scrollDown = () => {
    setSelectedIndex((prev) => Math.min(prev + 1, selectableList.length - 1));
  };

  const scrollUp = () => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0));
  };

  useInput((input, key) => {
    if (activeSection !== 'Files') return;
    if (key.upArrow) {
      scrollUp();
    } else if (key.downArrow) {
      scrollDown();
    }
  });

  // Calculate final array of shown items
  const parents = selectedValue ? getParents(selectedValue) : [];
  const slidingWindowSize = Math.max(1, outputLength - parents.length);

  // const visibleF = useRef
  const visibleTreeItems = useRef(new Set<string>());
  useEffect(() => {
    visibleTreeItems.current.clear();
    visibleTreeItems.current.add('.');
    if (selectableList.length <= outputLength) {
      selectableList.forEach((fp) => visibleTreeItems.current.add(fp));
    }

    // Remove parents from the pool to avoid duplicates in the slice
    const nonParentItems = selectableList.filter((item) => !parents.includes(item));

    // Find where the selected item is in the "pool"
    const poolSelectedIndex = selectedValue ? nonParentItems.indexOf(selectedValue) : 0;

    // Calculate a centered offset for the sliding window
    let start = Math.max(0, poolSelectedIndex - Math.floor(slidingWindowSize / 2));
    let end = start + slidingWindowSize;

    if (end > nonParentItems.length) {
      end = nonParentItems.length;
      start = Math.max(0, end - slidingWindowSize);
    }

    const slice = nonParentItems.slice(start, end);

    [...parents, ...slice].forEach((fp) => {
      visibleTreeItems.current.add(fp);
    });
  }, [selectableList.length, parents, slidingWindowSize, selectedValue]);

  useEffect(() => {
    if (resolved) {
      refresh();
    }
  }, [resolved]);

  return (
    <TreeNavigation.Provider
      value={{
        visibleParts,
        selectedFile: selectedValue,
        tree,
        refresh,
        visibleTreeItems: visibleTreeItems.current,
        visibilityVersion,
      }}
    >
      {children}
    </TreeNavigation.Provider>
  );
}

export function useTreeNavigation(): TreeNavigationType {
  const context = useContext(TreeNavigation);
  if (Object.keys(context).length === 0) {
    throw new Error('useTreeNavigation must be used within an TreeNavigationProvider');
  }
  return context;
}

/** Helper to get parents of a unix path */
const getParents = (path: string): string[] => {
  const parts = path.split('/');
  const parents: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    parents.push(parts.slice(0, i).join('/'));
  }
  return parents;
};
