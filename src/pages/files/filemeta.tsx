import { Box, measureElement, Text } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { Section } from '../../components/section';
import { useTreeNavigation } from './useTreeNavigation';
import { useEffect, useMemo, useRef } from 'react';
import { useNav } from '../../components/navigation';
import { useKeybindings } from '../../components/hooks/useKeybindings';

export function FileMeta() {
  const { sectionHeight } = useDimensions();
  const { activeSection } = useNav();
  const { selectedFile } = useTreeNavigation();

  const ref = useRef(null);
  const targetWidth = useMemo(() => {
    if (!ref.current) return 0;
    const { width } = measureElement(ref.current);
    return width - 4;
  }, [ref.current]);

  // eslint-disable-next-line no-unused-vars
  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {}, [activeSection]);

  return (
    <Box width="50%" height={sectionHeight} ref={ref}>
      <Section width="100%" title="File Meta" innerHeight={sectionHeight - 1}>
        {selectedFile && <Title width={targetWidth} text={selectedFile} />}
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
