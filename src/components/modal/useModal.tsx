import { useInput } from 'ink';
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { useNav } from '../navigation';
import { useKeybindings } from '../hooks/useKeybindings';

type ModalContextType = {
  setModal: (modal: ReactNode) => void;
  isOpen: Boolean;
  close: () => void;
  open: () => void;
  toggle: () => void;
};

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useKeybindings must be used within a KeybindingsProvider');
  }
  return context;
}

/** Should be the top most provider before app */
export function ModalProvider({ children }: PropsWithChildren) {
  const [modal, _setModal] = useState<ReactNode>(null);
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
  const setModal = (modal: ReactNode) => {
    close();
    _setModal(modal);
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

  return (
    <ModalContext.Provider value={{ setModal, open, close, toggle, isOpen }}>
      <>
        {children}
        {modal}
      </>
    </ModalContext.Provider>
  );
}
