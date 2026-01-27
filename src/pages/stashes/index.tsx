import { Box } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { Stashes } from './stashes';
import { StashDetails } from './stashDetails';
import { useKeybindings } from '../../components/hooks/useKeybindings';
import { useEffect } from 'react';

function AllSections() {
  const { sectionHeight, width } = useDimensions();

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    setKeybinding('s', 'stash');
    setKeybinding('p', 'pop');
    return () => removeKeybinding(['s', 'p']);
  }, []);

  return (
    <Box width={width} height={sectionHeight}>
      <Stashes />
      <StashDetails />
    </Box>
  );
}

export { AllSections as Stashes };
