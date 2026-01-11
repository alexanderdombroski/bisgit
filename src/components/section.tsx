import { Box, type BoxProps, Text } from 'ink';
import type { ReactNode } from 'react';
import { useDimensions } from './hooks/useDimensions';

export interface SectionProps extends BoxProps {
  children: ReactNode;
  title?: string;
  footer?: string;
  width?: number;
}

export function Section(props: SectionProps) {
  const { title, footer, children, width: inputWidth } = props;
  const { width } = useDimensions();
  const sectionWidth = inputWidth ?? width;
  const middleBorderLength = sectionWidth - 6;

  return (
    <Box flexDirection="column">
      {title && (
        <Text>{'╭────' + title + '─'.repeat(middleBorderLength - title.length) + '╮'}</Text>
      )}
      <Box
        flexDirection="column"
        {...props}
        borderStyle="round"
        borderTop={!title}
        borderBottom={!footer}
        paddingLeft={1}
      >
        {children}
      </Box>
      {footer && (
        <Text>{'╰' + '─'.repeat(middleBorderLength - footer.length) + footer + '────╯'}</Text>
      )}
    </Box>
  );
}
