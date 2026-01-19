import { useInput } from 'ink';
import { useEffect, useState } from 'react';
import { useNav } from '../navigation';
import { useKeybindings } from '../hooks/useKeybindings';

export type ModalControls = {
  isOpen: Boolean;
  close: () => void;
  open: () => void;
  toggle: () => void;
};

export function useModalControls(): ModalControls {
  const { lock, unlock } = useNav();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => {
    unlock();
    setIsOpen(false);
  };
  const open = () => {
    lock();
    setIsOpen(true);
  };
  const toggle = () => {
    isOpen ? close() : open();
  };

  useInput((input, key) => {
    if (key.escape) {
      close();
    }
  });

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    if (!isOpen) return;
    setKeybinding('esc', 'close');
    return () => {
      removeKeybinding('esc');
    };
  }, [isOpen]);

  return { isOpen, close, open, toggle };
}
