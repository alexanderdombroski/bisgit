import { useInput } from 'ink';
import { useEffect, useState } from 'react';
import { useKeybindings } from './useKeybindings';

type TruncateMode = 'truncate-start' | 'truncate-middle' | 'truncate-end';

const LEFT_ARROW = '\u{2190}';
const RIGHT_ARROW = '\u{2192}';

export function useTruncationMode(): { mode: TruncateMode } {
  const [mode, setMode] = useState<TruncateMode>('truncate-end');

  const { removeKeybinding, setKeybinding } = useKeybindings();
  useEffect(() => {
    if (mode === 'truncate-start') {
      setKeybinding(LEFT_ARROW, 'pan left');
    } else {
      setKeybinding(RIGHT_ARROW, 'pan right');
    }
    return () => {
      removeKeybinding([RIGHT_ARROW, LEFT_ARROW]);
    };
  }, [mode]);

  useInput((input, key) => {
    if (key.rightArrow) {
      setMode('truncate-start');
    } else if (key.leftArrow) {
      setMode('truncate-end');
    }
  });

  return { mode };
}
