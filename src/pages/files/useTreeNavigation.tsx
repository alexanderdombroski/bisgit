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
  expandedFiles: Set<string>;
  visibleFiles: Set<string>;
  selectedFile?: string;
  tree?: Tree;
  version: number;
};

const TreeNavigation = createContext({} as TreeNavigationType);

export function TreeNavigationProvder({ children }: PropsWithChildren) {
  const { activeSection } = useNav();
  const { sectionHeight } = useDimensions();
  const outputLength = sectionHeight - 3;

  // Tree State
  const { value: { tree, files } = {}, resolved } = useResolved(formatFileTree);
  const expandedFiles = useRef(new Set<string>());
  const visibleFiles = useRef(new Set<string>(['.']));
  const [selectedFile, setSelectedFile] = useState<string>();

  // Initialize State
  useEffect(() => {
    if (tree && files) {
      expandedFiles.current = new Set(Object.keys(tree));
      setSelectedFile(files[0]);
    }
  }, [resolved]);

  const selectableList = useMemo(
    () => files?.filter((fp) => expandedFiles.current.has(fp)) ?? [],
    [expandedFiles.current.size, resolved]
  );

  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((prev) => prev + 1);

  // Controls
  useInput((input, key) => {
    if (activeSection !== 'Files' || !tree || !selectedFile) return;
    if (key.upArrow) {
      const i = Math.max(0, selectableList.indexOf(selectedFile) - 1);
      setSelectedFile(selectableList[i]);
      refresh();
    } else if (key.downArrow) {
      const i = Math.min(selectableList.length - 1, selectableList.indexOf(selectedFile) + 1);
      setSelectedFile(selectableList[i]);
      refresh();
    }

    let folderAction;
    if (key.leftArrow) {
      folderAction = 'collapse';
    } else if (key.rightArrow) {
      folderAction = 'expand';
    }
    if (folderAction) {
      const contents = getContents(tree, selectedFile);
      if (!contents) return;
      for (let file of Object.keys(contents)) {
        const path = `${selectedFile}/${file}`;
        folderAction === 'expand'
          ? expandedFiles.current.add(path)
          : expandedFiles.current.delete(path);
      }
      refresh();
    }
  });

  // Calculate final shown items
  useEffect(() => {
    visibleFiles.current.clear();
    visibleFiles.current.add('.');
    if (selectableList.length <= outputLength) {
      selectableList.forEach((fp) => visibleFiles.current.add(fp));
      return;
    }

    const parents = selectedFile ? getParents(selectedFile) : [];
    const slidingWindowSize = Math.max(1, outputLength - parents.length);

    // Remove parents from the pool to avoid duplicates in the slice
    const nonParentItems = selectableList.filter((item) => !parents.includes(item));

    // Find where the selected item is in the "pool"
    const poolSelectedIndex = selectedFile ? nonParentItems.indexOf(selectedFile) : 0;

    // Calculate a centered offset for the sliding window
    let start = Math.max(0, poolSelectedIndex - Math.floor(slidingWindowSize / 2));
    let end = start + slidingWindowSize;

    if (end > nonParentItems.length) {
      end = nonParentItems.length;
      start = Math.max(0, end - slidingWindowSize);
    }

    const slice = nonParentItems.slice(start, end);

    [...parents, ...slice].forEach((fp) => {
      visibleFiles.current.add(fp);
    });
  }, [selectableList.length, selectedFile, outputLength]);

  return (
    <TreeNavigation.Provider
      value={{
        version,
        tree,
        visibleFiles: visibleFiles.current,
        expandedFiles: expandedFiles.current,
        selectedFile,
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

// --------------- UTILS ---------------

export const getContents = (tree: Tree, path: string) => {
  const parts = path.split('/');
  let contents = tree;
  for (let part of parts) {
    contents = contents[part];
  }
  return contents;
};

const formatFileTree = async () => {
  const tree = await getFileTree();
  const files = flattenTree(tree);
  return { tree, files };
};

/** Helper to get parents of a unix path */
const getParents = (path: string): string[] => {
  const parts = path.split('/');
  const parents: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    parents.push(parts.slice(0, i).join('/'));
  }
  return parents;
};
