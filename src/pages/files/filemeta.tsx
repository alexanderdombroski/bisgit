import { Box, measureElement, Text } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { Section } from '../../components/section';
import { useTreeNavigation } from './useTreeNavigation';
import { useMemo, useRef } from 'react';

export function FileMeta({}) {
  const { sectionHeight } = useDimensions();
  const { selectedFile } = useTreeNavigation();
  const ref = useRef(null);
  const targetWidth = useMemo(() => {
    if (!ref.current) return 0;
    const { width } = measureElement(ref.current);
    return width - 4;
  }, [ref.current]);

  return (
    <Box width="50%" height={sectionHeight} ref={ref}>
      <Section title="File Meta" width="100%" innerHeight="100%">
        {selectedFile && <Title width={targetWidth} text={selectedFile} />}
      </Section>
    </Box>
  );
}

export function Title({ width, text }: { width: number; text: string }) {
  if (text.length > width) {
    return <Text wrap="truncate-end">{text}</Text>;
  }

  const totalPadding = Math.max(0, width - text.length - 2);
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  const paddedText = `${'='.repeat(leftPadding)} ${text} ${'='.repeat(rightPadding)}`;

  return <Text>{paddedText}</Text>;
}
