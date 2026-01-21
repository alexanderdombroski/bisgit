import React, { useState } from 'react';
import { useInput } from 'ink';
import TextInput from 'ink-text-input';
import type { ModalControls } from './useModal';
import { Modal } from './modal';

type ModalProps = {
  title: string;
  handleSubmit: (value: string) => void;
  modalControls: ModalControls;
};

export function ModalInput({ title, handleSubmit, modalControls }: ModalProps) {
  const [value, setValue] = useState('');
  const { isOpen, close } = modalControls;

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
      <Modal title={title}>
        <TextInput value={value} onChange={setValue} />
      </Modal>
    )
  );
}
