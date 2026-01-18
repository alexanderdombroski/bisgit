import { useEffect } from 'react';
import { useDimensions } from '../../components/hooks/useDimensions';
import { useKeybindings } from '../../components/hooks/useKeybindings';
import { Box } from 'ink';
import Branches from './branches';
import { Remotes } from './remotes';
import { Worktrees } from './worktrees';

function AllSections() {
  const { width, sectionHeight } = useDimensions();

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    setKeybinding('c', 'create');
    setKeybinding('d', 'delete');
    return () => {
      removeKeybinding(['c', 'd']);
    };
  }, []);

  return (
    <>
      <Box width={width} height={sectionHeight}>
        <Box flexDirection="column" width="50%" height={sectionHeight}>
          <Branches />
          <Worktrees />
        </Box>
        <Remotes />
      </Box>
    </>
  );
}

export { AllSections as Branches };
