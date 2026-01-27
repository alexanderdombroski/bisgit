import { Box, Text } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { Section } from '../../components/section';
import { useTreeNavigation } from './useTreeNavigation';
import { useResolved } from '../../components/hooks/useResolved';
import { type FileChange, getLastFileEditInfo, getLinesChanged } from '../../utils/git';
import { useTruncationMode } from '../../components/hooks/useTruncationMode';
import { Title } from '../../components/title';

export function FileMeta() {
  const { sectionHeight } = useDimensions();
  const { selectedFile } = useTreeNavigation();

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
    <Box width="50%" height={sectionHeight}>
      <Section width="100%" title="File Meta" innerHeight={sectionHeight - 1}>
        {selectedFile && <Title text={selectedFile} />}
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
