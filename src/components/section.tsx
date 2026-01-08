import { Box, type BoxProps, Text } from 'ink';
import type { ReactNode } from 'react';
import { useDimensions } from './hooks/useDimensions';

interface SectionProps extends BoxProps {
  children: ReactNode;
  title?: string;
  footer?: string;
}

export function Section(props: SectionProps) {
  const { title, footer, children } = props;
  const { width } = useDimensions();

  return (
    <Box flexDirection="column">
      {title && <Text>{'╭────' + title + '─'.repeat(width - title.length - 6) + '╮'}</Text>}
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
      {footer && <Text>{'╰' + '─'.repeat(width - footer.length - 6) + footer + '────╯'}</Text>}
    </Box>
  );
}
