import { Box, type BoxProps, Text, useStdout } from 'ink';
import type { ReactNode } from 'react';

interface SectionProps extends BoxProps {
  children: ReactNode;
  title?: string;
  footer?: string;
}

export function Section(props: SectionProps) {
  const { title, footer, children } = props;

  const { stdout } = useStdout();

  return (
    <Box flexDirection="column">
      {title && (
        <Text>{'╭────' + title + '─'.repeat(stdout.columns - title.length - 6) + '╮'}</Text>
      )}
      <Box flexDirection="column" {...props} borderTop={!title} borderBottom={!footer}>
        {children}
      </Box>
      {footer && (
        <Text>{'╰' + '─'.repeat(stdout.columns - footer.length - 6) + footer + '────╯'}</Text>
      )}
    </Box>
  );
}
