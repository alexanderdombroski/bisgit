import type { PropsWithChildren } from 'react';
import { useDimensions } from '../hooks/useDimensions';
import { Box } from 'ink';
import { Section } from '../section';
import { useTheme } from '../hooks/useTheme';

const MODAL_DEFAULT_WIDTH = 36;

type ModalProps = PropsWithChildren<{
  title: string;
  width?: number;
}>;

export function Modal({ children, title, width: modalWidth = MODAL_DEFAULT_WIDTH }: ModalProps) {
  const dimensions = useDimensions();
  const { width } = dimensions;
  const margin = Math.floor((width - modalWidth) / 2);
  const { bgColor } = useTheme();

  return (
    <Box {...dimensions} position="absolute">
      <Box alignSelf="center" marginLeft={margin} marginRight={margin}>
        <Section title={title} width={modalWidth} isModal backgroundColor={bgColor}>
          {children}
        </Section>
      </Box>
    </Box>
  );
}
