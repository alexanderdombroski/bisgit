import { Box, measureElement, Text } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { Section } from '../../components/section';
import { useTreeNavigation } from './useTreeNavigation';
import { useMemo, useRef } from 'react';
import { useResolved } from '../../components/hooks/useResolved';
import { getLastFileEditInfo } from '../../utils/git';
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
  const { mode } = useTruncationMode();

  return (
    <Box width="50%" height={sectionHeight} ref={ref}>
      <Section width="100%" title="File Meta" innerHeight={sectionHeight - 1}>
        {selectedFile && <Title width={targetWidth} text={selectedFile} />}
        {shortHash && <Text wrap={mode}>Last Commit: {shortHash}</Text>}
        {authorName && <Text wrap={mode}>Edited By: {authorName}</Text>}
        {authorDate && <Text wrap={mode}>Edit On: {authorDate}</Text>}
        {authorEmail && <Text wrap={mode}>Contact: {authorEmail}</Text>}
      </Section>
    </Box>
  );
}

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
