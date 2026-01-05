// KeybindingsContext.ts
import { createContext, useContext, useState, type ReactNode } from 'react';

type Keybindings = Record<string, string>;

type KeybindingsContextType = {
  keybindings: Keybindings;
  setKeybinding: (key: string, action: string) => void;
};

const KeybindingsContext = createContext<KeybindingsContextType | undefined>(undefined);

export const KeybindingsProvider = ({ children }: { children: ReactNode }) => {
  const [keybindings, setKeybindings] = useState<Keybindings>({});

  const setKeybinding = (key: string, action: string) => {
    setKeybindings((prev) => ({ ...prev, [key]: action }));
  };

  return (
    <KeybindingsContext.Provider value={{ keybindings, setKeybinding }}>
      {children}
    </KeybindingsContext.Provider>
  );
};

// Hook to use the context
export const useKeybindings = () => {
  const context = useContext(KeybindingsContext);
  if (!context) {
    throw new Error('useKeybindings must be used within a KeybindingsProvider');
  }
  return context;
};
