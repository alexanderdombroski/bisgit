import { useInput } from 'ink';
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { useNav } from '../navigation';
import { useKeybindings } from '../hooks/useKeybindings';

type ModalContextType = {
  setModal: (modal: ReactNode, options?: ModalOptions) => void;
  isOpen: Boolean;
  close: () => void;
  open: () => void;
  toggle: () => void;
};

type ModalOptions = {
  onClose?: () => void;
};

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export function useModal() {
  const context = useContext(ModalContext);
  if (Object.keys(context).length === 0) {
    throw new Error('useKeybindings must be used within a KeybindingsProvider');
  }
  return context;
}

/** Should be the top most provider before app */
export function ModalProvider({ children }: PropsWithChildren) {
  const [modal, _setModal] = useState<ReactNode>(null);
  const { lock, unlock } = useNav();
  const [isOpen, setIsOpen] = useState(false);
  const [onClose, setOnClose] = useState<() => void>();

  const close = () => {
    unlock();
    setIsOpen(false);
    onClose?.();
    _setModal(null);
  };
  const open = () => {
    lock();
    setIsOpen(true);
  };
  const toggle = () => {
    isOpen ? close() : open();
  };
  const setModal = (modal: ReactNode, options?: ModalOptions) => {
    close();
    setOnClose(options?.onClose);
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
