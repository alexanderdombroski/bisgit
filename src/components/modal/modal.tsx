import type { PropsWithChildren } from 'react';
import { useDimensions } from '../hooks/useDimensions';
import { Box } from 'ink';
import { Section } from '../section';
import { useTheme } from '../hooks/useTheme';

const MODAL_WIDTH = 36;

type ModalProps = PropsWithChildren<{
  title: string;
}>;

export function Modal({ children, title }: ModalProps) {
  const dimensions = useDimensions();
  const { width } = dimensions;
  const margin = Math.floor((width - MODAL_WIDTH) / 2);
  const { bgColor } = useTheme();

  return (
    <Box {...dimensions} position="absolute">
      <Box alignSelf="center" marginLeft={margin} marginRight={margin}>
        <Section title={title} width={MODAL_WIDTH} isModal backgroundColor={bgColor}>
          {children}
        </Section>
      </Box>
    </Box>
  );
}
