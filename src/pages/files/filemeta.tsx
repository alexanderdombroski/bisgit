import { Box, measureElement, Text } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { Section } from '../../components/section';
import { useTreeNavigation } from './useTreeNavigation';
import { useMemo, useRef } from 'react';
import { useResolved } from '../../components/hooks/useResolved';
import { type FileChange, getLastFileEditInfo, getLinesChanged } from '../../utils/git';
import { useTruncationMode } from '../../components/hooks/useTruncationMode';

export function FileMeta() {
  const { sectionHeight } = useDimensions();
  const { selectedFile } = useTreeNavigation();

  const ref = useRef(null);
  const targetWidth = useMemo(() => {
    if (!ref.current) return 0;
    const { width } = measureElement(ref.current);
    return width - 4;
  }, [ref.current]);

  const { value = {} } = useResolved(
    () => getLastFileEditInfo(selectedFile as string),
    [selectedFile]
  );
  const { authorDate, authorEmail, authorName, shortHash } = value;
  const { value: { added, deleted } = {}, resolved } = useResolved(
    async () => getRecentFileLines(shortHash, selectedFile),
    [shortHash, selectedFile]
  );
  const { mode } = useTruncationMode();

  return (
    <Box width="50%" height={sectionHeight} ref={ref}>
      <Section width="100%" title="File Meta" innerHeight={sectionHeight - 1}>
        {selectedFile && <Title width={targetWidth} text={selectedFile} />}
        {shortHash && <Text wrap={mode}>Last Commit: {shortHash}</Text>}
        {authorName && <Text wrap={mode}>Edited By: {authorName}</Text>}
        {authorDate && <Text wrap={mode}>Edit On: {authorDate}</Text>}
        {authorEmail && <Text wrap={mode}>Contact: {authorEmail}</Text>}
        {resolved && (added || deleted) && (
          <Box flexDirection="row" flexWrap="nowrap">
            <Text>Changes:&nbsp;</Text>
            <Text color="green">+{added ?? 0}&nbsp;</Text>
            <Text color="red">-{deleted ?? 0}</Text>
          </Box>
        )}
      </Section>
    </Box>
  );
}

const getRecentFileLines = async (
  shortHash?: string,
  selectedFile?: string
): Promise<FileChange> => {
  if (!shortHash || !selectedFile) return {} as FileChange;
  const changes = await getLinesChanged(shortHash);
  return changes.find(({ file }) => selectedFile === file) ?? ({} as FileChange);
};

export function Title({ width, text }: { width: number; text: string }) {
  if (text.length > width) {
    return <Text>{text}</Text>;
  }

  const totalPadding = Math.max(0, width - text.length - 2);
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  const paddedText = `${'='.repeat(leftPadding)} ${text} ${'='.repeat(rightPadding)}`;

  return <Text>{paddedText}</Text>;
}
