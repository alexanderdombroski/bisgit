import React, { useState } from 'react';
import { useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useModal } from './useModal';
import { Modal } from './modal';

type ModalProps = {
  title: string;
  handleSubmit: (value: string) => void;
  width?: number;
};

export function ModalInput({ title, handleSubmit, width }: ModalProps) {
  const [value, setValue] = useState('');
  const { isOpen, close } = useModal();

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
      <Modal title={title} width={width}>
        <TextInput value={value} onChange={setValue} />
      </Modal>
    )
  );
}
