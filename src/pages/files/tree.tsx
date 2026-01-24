import { Box, Text, useInput } from 'ink';
import path from 'node:path';
import { useResolved } from '../../components/hooks/useResolved';
import { Section } from '../../components/section';
import { getGitDirRoot } from '../../utils/git';
import { useEffect, useState } from 'react';
import { useTreeNavigation } from './useTreeNavigation';

const RIGHT_ARROW = '\u{2192}';
const DOWN_ARROW = '\u{2193}';

export function Tree() {
  const { tree } = useTreeNavigation();
  const { value: pwd } = useResolved(getGitDirRoot);

  return (
    <Section title="Files">
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
};

type FolderProps = FileProps & {
  contents: Record<string, any>;
  isRoot?: boolean;
};

function Folder(props: FolderProps) {
  const { contents, depth, fp, rp = '', isRoot = false } = props;
  const [isExpanded, setIsExpanded] = useState(isRoot);
  const isFile = Object.keys(contents).length === 0;
  const { visibleParts, selectedFile } = useTreeNavigation();

  useInput((input, key) => {
    if (isFile || fp !== selectedFile) return;
    if (key.rightArrow) {
      setIsExpanded(true);
    } else if (key.leftArrow) {
      setIsExpanded(false);
    }
  });

  useEffect(() => {
    if (isFile || isExpanded) {
      if (!visibleParts.has(fp)) {
        visibleParts.add(fp);
      }
    } else {
      if (visibleParts.has(fp)) {
        visibleParts.delete(fp);
      }
    }
  }, [isFile, isExpanded]);

  if (isFile) return <File {...props} />; // empty file

  const newDepth = depth + 2;
  return (
    <>
      {/* folder name */}
      <Box flexDirection="row" flexWrap="nowrap">
        <Box width={2}>
          <Text>{isExpanded ? DOWN_ARROW : RIGHT_ARROW}</Text>
        </Box>
        <Box width="100%">
          <File {...props} />
        </Box>
      </Box>
      {isExpanded &&
        Object.entries(contents).map(([name, contents]) => {
          const fullPath = path.join(fp, name);
          const relativePath = path.join(rp, name);
          // folder contents (file or folder)
          return (
            <Folder
              key={fullPath}
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

function File({ name, depth, rp }: FileProps) {
  const { selectedFile } = useTreeNavigation();

  return (
    <Text wrap="truncate-end" color={rp === selectedFile ? 'yellow' : undefined}>
      {'\u00A0'.repeat(depth)}
      {name}
    </Text>
  );
}
