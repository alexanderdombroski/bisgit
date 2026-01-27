import { Box } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { Stashes } from './stashes';
import { StashDetails } from './stashDetails';
import { useKeybindings } from '../../components/hooks/useKeybindings';
import { useEffect, useState } from 'react';

function AllSections() {
  const { sectionHeight, width } = useDimensions();
  const [stash, setStash] = useState<string>();

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    setKeybinding('s', 'stash');
    setKeybinding('d', 'drop');
    setKeybinding('a', 'apply');
    setKeybinding('p', 'pop');
    return () => removeKeybinding(['s', 'p', 'd', 'a']);
  }, []);

  return (
    <Box width={width} height={sectionHeight}>
      <Stashes setStash={setStash} />
      <StashDetails stash={stash} />
    </Box>
  );
}

export { AllSections as Stashes };
