import { Box, Text, useInput } from 'ink';
import path from 'node:path';
import { useResolved } from '../../components/hooks/useResolved';
import { Section } from '../../components/section';
import { getGitDirRoot } from '../../utils/git';
import { memo, useEffect, useState } from 'react';
import { useTreeNavigation } from './useTreeNavigation';
import { useDimensions } from '../../components/hooks/useDimensions';
import { useKeybindings } from '../../components/hooks/useKeybindings';
import { useNav } from '../../components/navigation';

const LEFT_ARROW = '\u{2190}';
const UP_ARROW = '\u{2191}';
const RIGHT_ARROW = '\u{2192}';
const DOWN_ARROW = '\u{2193}';

const NAVIGATION_KEY = `${LEFT_ARROW}${UP_ARROW}${DOWN_ARROW}${RIGHT_ARROW}`;

export function Tree() {
  const { sectionHeight } = useDimensions();
  const { tree, visibilityVersion } = useTreeNavigation();
  const { value: pwd } = useResolved(getGitDirRoot);
  const [, setId] = useState(0);

  useEffect(() => {
    setId((prev) => prev + 1);
  }, [visibilityVersion]);

  const { setKeybinding, removeKeybinding } = useKeybindings();
  const { activeSection } = useNav();

  useEffect(() => {
    if (activeSection === 'Files') {
      setKeybinding(NAVIGATION_KEY, 'NAVIGATION_KEY');
      return () => removeKeybinding(NAVIGATION_KEY);
    }
  }, [activeSection]);

  return (
    <Section title="Files" innerHeight={sectionHeight} width="50%">
      {pwd && tree && (
        <Folder name={path.basename(pwd)} contents={tree} depth={0} fp={pwd} isRoot />
      )}
    </Section>
  );
}

type FileProps = {
  name: string;
  depth: number;
  fp: string;
  rp?: string;
  isSelected?: boolean;
};

type FolderProps = FileProps & {
  contents: Record<string, any>;
  isRoot?: boolean;
};

function Folder(props: FolderProps) {
  const { contents, depth, fp, rp = '.', isRoot = false } = props;
  const isFile = Object.keys(contents).length === 0;
  const [isExpanded, setIsExpanded] = useState(isRoot || isFile);
  const { visibleParts, selectedFile, refresh, visibleTreeItems } = useTreeNavigation();
  const isSelected = rp === selectedFile;

  useInput((input, key) => {
    if (isFile || rp !== selectedFile) return;
    if (key.rightArrow) {
      setIsExpanded(true);
    } else if (key.leftArrow) {
      setIsExpanded(false);
    }
  });

  useEffect(() => {
    const operation = isExpanded ? 'add' : 'delete';
    const prevLen = visibleParts.size;

    for (const key of Object.keys(contents)) {
      const id = path.join(rp, key);
      if (operation === 'add') {
        visibleParts.add(id);
      } else {
        visibleParts.delete(id);
      }
    }

    if (prevLen !== visibleParts.size) {
      refresh();
    }
  }, [isExpanded]);

  if (!visibleTreeItems.has(rp)) return null;

  const newDepth = depth + 2;
  if (isFile) return <File key={fp} {...props} depth={newDepth} isSelected={isSelected} />; // empty file

  return (
    <>
      {/* folder name */}
      <Box flexDirection="row" flexWrap="nowrap">
        <Box width={2}>
          <Text>{isExpanded ? DOWN_ARROW : RIGHT_ARROW}</Text>
        </Box>
        <Box width="100%">
          <File {...props} isSelected={isSelected} />
        </Box>
      </Box>
      {isExpanded &&
        Object.entries(contents).map(([name, contents]) => {
          const fullPath = path.join(fp, name);
          const relativePath = path.join(rp, name);
          // folder contents (file or folder)
          return (
            <Folder
              key={`${fullPath}-${isExpanded}`}
              name={name}
              contents={contents}
              depth={newDepth}
              rp={relativePath}
              fp={fullPath}
            />
          );
        })}
    </>
  );
}

const File = memo<FileProps>(
  ({ name, depth, isSelected }) => {
    return (
      <Text wrap="truncate-end" color={isSelected ? 'yellow' : undefined}>
        {'\u00A0'.repeat(depth)}
        {name}
      </Text>
    );
  },
  (prev, next) => prev.isSelected === next.isSelected && prev.fp === next.fp
);
