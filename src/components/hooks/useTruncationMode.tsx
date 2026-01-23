import { useInput } from 'ink';
import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { useKeybindings } from './useKeybindings';

type TruncateMode = 'truncate-start' | 'truncate-middle' | 'truncate-end';

const LEFT_ARROW = '\u{2190}';
const RIGHT_ARROW = '\u{2192}';

// 1️⃣ Define the shape of your context
type TruncationContextType = {
  mode: TruncateMode;
  _isToggleable: number;
  _setIsToggleable: Dispatch<SetStateAction<number>>;
};

// 2️⃣ Create the context with a default value
const TruncationMode = createContext({} as TruncationContextType);

export function TruncationModeProvder({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<TruncateMode>('truncate-end');
  const [_isToggleable, _setIsToggleable] = useState(0);

  const { removeKeybinding, setKeybinding } = useKeybindings();
  useEffect(() => {
    if (_isToggleable) {
      if (mode === 'truncate-start') {
        setKeybinding(LEFT_ARROW, 'pan left');
      } else {
        setKeybinding(RIGHT_ARROW, 'pan right');
      }
    }
    return () => {
      removeKeybinding([RIGHT_ARROW, LEFT_ARROW]);
    };
  }, [mode, _isToggleable]);

  useInput((input, key) => {
    if (!_isToggleable) return;
    if (key.rightArrow) {
      setMode('truncate-start');
    } else if (key.leftArrow) {
      setMode('truncate-end');
    }
  });

  return (
    <TruncationMode.Provider value={{ mode, _isToggleable, _setIsToggleable }}>
      {children}
    </TruncationMode.Provider>
  );
}

export function useTruncationMode(): { mode: TruncateMode } {
  const context = useContext(TruncationMode);
  if (!context) {
    throw new Error('useTruncationMode must be used within an TruncationModeProvider');
  }

  const { mode, _setIsToggleable } = context;
  useEffect(() => {
    _setIsToggleable((prev) => prev + 1);
    return () => _setIsToggleable((prev) => prev - 1);
  }, []);

  return { mode };
}
