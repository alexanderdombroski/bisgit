// KeybindingsContext.ts
import { createContext, useContext, useState, type ReactNode } from 'react';

type Keybindings = Record<string, string>;

type KeybindingsContextType = {
  keybindings: Keybindings;
  setKeybinding: (key: string, action: string) => void;
  removeKeybinding: (key: string | string[]) => void;
};

const KeybindingsContext = createContext<KeybindingsContextType | undefined>(undefined);

export const KeybindingsProvider = ({ children }: { children: ReactNode }) => {
  const [keybindings, setKeybindings] = useState<Keybindings>({});

  const setKeybinding = (key: string, action: string) => {
    setKeybindings((prev) => ({ ...prev, [key]: action }));
  };

  const removeKeybinding = (keys: string | string[]) => {
    const keysToRemove = Array.isArray(keys) ? keys : [keys];

    setKeybindings((prev) => {
      const next = { ...prev };
      for (const key of keysToRemove) {
        delete next[key];
      }
      return next;
    });
  };

  return (
    <KeybindingsContext.Provider value={{ keybindings, setKeybinding, removeKeybinding }}>
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
