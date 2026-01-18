import React, { useState } from 'react';
import { Box, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useDimensions } from '../hooks/useDimensions';
import type { ModalControls } from './useModal';
import { Section } from '../section';

type ModalProps = {
  title: string;
  handleSubmit: (value: string) => void;
  modalControls: ModalControls;
};

const MODAL_WIDTH = 36;

export function ModalInput({ title, handleSubmit, modalControls }: ModalProps) {
  const [value, setValue] = useState('');
  const { isOpen, close } = modalControls;
  const dimensions = useDimensions();
  const { width } = dimensions;
  const margin = Math.floor((width - MODAL_WIDTH) / 2);

  useInput((input, key) => {
    if (key.return) {
      if (isOpen) {
        handleSubmit(value);
        setValue('');
        close();
      }
    }
  });

  return (
    isOpen && (
      <Box {...dimensions} position="absolute">
        <Box alignSelf="center" marginLeft={margin} marginRight={margin}>
          <Section title={title} width={MODAL_WIDTH}>
            <TextInput value={value} onChange={setValue} />
          </Section>
        </Box>
      </Box>
    )
  );
}
