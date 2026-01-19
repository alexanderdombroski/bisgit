import { Box, useInput } from 'ink';
import { useDimensions } from '../hooks/useDimensions';
import type { ModalControls } from './useModal';
import { Section } from '../section';
import SelectInput from 'ink-select-input';

type Option = { value: string; label: string };

type ModalProps = {
  title: string;
  options: Option[];
  handleSubmit: ({ value, label }: Option) => void;
  modalControls: ModalControls;
  initialIndex: number;
};

const MODAL_WIDTH = 36;

export function QuickPick({
  title,
  handleSubmit,
  options,
  modalControls,
  initialIndex,
}: ModalProps) {
  const { isOpen, close } = modalControls;
  const dimensions = useDimensions();
  const { width } = dimensions;
  const margin = Math.floor((width - MODAL_WIDTH) / 2);

  useInput((input, key) => {
    if (key.return) {
      if (isOpen) {
        close();
      }
    }
  });

  return (
    isOpen && (
      <Box {...dimensions} position="absolute">
        <Box alignSelf="center" marginLeft={margin} marginRight={margin}>
          <Section title={title} width={MODAL_WIDTH} isModal>
            <SelectInput items={options} onSelect={handleSubmit} initialIndex={initialIndex} />
          </Section>
        </Box>
      </Box>
    )
  );
}
