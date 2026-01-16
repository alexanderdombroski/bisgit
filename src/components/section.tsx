import { Box, type BoxProps, measureElement, Text } from 'ink';
import { useMemo, useRef, type ReactNode } from 'react';
import { useDimensions } from './hooks/useDimensions';

export interface SectionProps extends BoxProps {
  children: ReactNode;
  title?: string;
  footer?: string;
  innerHeight?: string | number;
}

export function Section(props: SectionProps) {
  const { title, footer, children, width, height, innerHeight } = props;
  const { width: demensionWidth } = useDimensions();
  const sectionWidth = width ?? demensionWidth;
  const ref = useRef(null);
  const targetWidth = useMemo(() => {
    if (!ref.current) return 0;
    const { width } = measureElement(ref.current);
    return width;
  }, [ref.current]);

  const middleBorderLength = targetWidth - 8;

  const innerBoxProps = { ...props, height: innerHeight, width: targetWidth };

  return (
    <Box ref={ref} flexDirection="column" height={height} width={sectionWidth}>
      {targetWidth !== 0 && (
        <>
          {title && (
            <Text wrap="truncate-end">
              {'╭──── ' + title + ' ' + '─'.repeat(middleBorderLength - title.length) + '╮'}
            </Text>
          )}
          <Box
            flexDirection="column"
            {...innerBoxProps}
            borderStyle="round"
            borderTop={!title}
            borderBottom={!footer}
            paddingLeft={1}
          >
            {children}
          </Box>
          {footer && (
            <Text>
              {'╰' + '─'.repeat(middleBorderLength - footer.length) + ' ' + footer + ' ────╯'}
            </Text>
          )}
        </>
      )}
    </Box>
  );
}
