import { Box, measureElement, Text } from 'ink';
import { useMemo, useRef } from 'react';

type TitleProps = {
  text: string;
};

export function Title({ text }: TitleProps) {
  const ref = useRef(null);
  const targetWidth = useMemo(() => {
    if (!ref.current) return 0;
    const { width } = measureElement(ref.current);
    return width - 4;
  }, [ref.current]);

  const totalPadding = Math.max(0, targetWidth - text.length);
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;
  const paddedText = `${'='.repeat(leftPadding)} ${text} ${'='.repeat(rightPadding)}`;

  return (
    <Box width="100%" ref={ref}>
      {text.length > targetWidth ? <Text>{text}</Text> : <Text>{paddedText}</Text>}
    </Box>
  );
}
