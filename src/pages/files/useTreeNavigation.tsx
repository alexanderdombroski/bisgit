import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { useResolved } from '../../components/hooks/useResolved';
import { useScrollable } from '../../components/hooks/useScrollable';
import { useDimensions } from '../../components/hooks/useDimensions';
import { useInput } from 'ink';
import { useNav } from '../../components/navigation';
import { flattenTree, getFileTree, type Tree } from '../../utils/fs';

type TreeNavigationType = {
  visibleParts: Set<string>;
  selectedFile?: string;
  tree?: Tree;
};

const TreeNavigation = createContext({} as TreeNavigationType);

export function TreeNavigationProvder({ children }: PropsWithChildren) {
  const { value: tree } = useResolved(getFileTree);
  const visibleParts = useMemo(() => new Set<string>(Object.keys(tree ?? {})), [tree]);
  const { sectionHeight } = useDimensions();
  const { activeSection } = useNav();

  const selectableList = useMemo(() => {
    if (!tree) return [];
    const files = flattenTree(tree);
    return files.filter((fp) => visibleParts.has(fp)) ?? [];
  }, [visibleParts.size, tree]);

  const { scrollDown, scrollUp, selectedValue } = useScrollable(selectableList, sectionHeight - 2);

  useInput((input, key) => {
    if (activeSection !== 'Files') return;
    if (key.upArrow) {
      scrollUp();
    } else if (key.downArrow) {
      scrollDown();
    }
  });

  return (
    <TreeNavigation.Provider value={{ visibleParts, selectedFile: selectedValue, tree }}>
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
