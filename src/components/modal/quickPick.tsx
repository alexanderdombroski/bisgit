import { Box, useInput } from 'ink';
import { useDimensions } from '../hooks/useDimensions';
import type { ModalControls } from './useModal';
import { Section } from '../section';
import SelectInput from 'ink-select-input';

type Option<V, L extends string = string> = { value: V; label: L };

type ModalProps<V, L extends string = string> = {
  title: string;
  options: Readonly<Option<V, L>[]>;
  handleSubmit: (option: Option<V, L>) => void;
  modalControls: ModalControls;
  initialIndex: number;
};

const MODAL_WIDTH = 36;

export function QuickPick<V, L extends string = string>({
  title,
  handleSubmit,
  options,
  modalControls,
  initialIndex,
}: ModalProps<V, L>) {
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
            <SelectInput
              // Casting is neccessary due to generic typing limiartions of library
              items={options as Option<V, L>[]}
              onSelect={handleSubmit as (item: Option<V>) => void}
              initialIndex={initialIndex}
            />
          </Section>
        </Box>
      </Box>
    )
  );
}
