import { useStdout } from 'ink';
import { useKeybindings } from './useKeybindings';
import { useMemo } from 'react';

// [1]: Files | [2]: Status | [3]: Log | [4]: Branches | [5]: Stash
const NAV_HEADER_WIDTH = 64;

export function useDimensions() {
  const { stdout } = useStdout();
  const { keybindings } = useKeybindings();
  const reservedHeight = useMemo(() => {
    const width = Object.entries(keybindings)
      .map(([k, v]) => `[${k}]: ${v}`)
      .join(' ').length;
    return Math.ceil(width / stdout.columns) + Math.ceil(NAV_HEADER_WIDTH / stdout.columns);
  }, [Object.keys(keybindings).join(',')]);

  const sectionHeight = stdout.rows - reservedHeight;
  const sectionHalfHeight = Math.floor(sectionHeight / 2);
  const modalWidth = stdout.columns > 100 ? 96 : stdout.columns - 4;

  return {
    width: stdout.columns,
    height: stdout.rows,
    sectionHeight,
    sectionHalfHeight,
    modalWidth,
  };
}
