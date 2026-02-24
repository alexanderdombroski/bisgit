import { Box, useInput } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { FileList } from './fileList';
import { StatusDetails } from './statusDetails';
import { useStatus } from '../../components/hooks/useStatus';
import { useEffect } from 'react';
import { useKeybindings } from '../../components/hooks/useKeybindings';

function AllSections() {
  const { width, sectionHeight } = useDimensions();
  const { refresh } = useStatus();

  useEffect(() => {
    refresh();
  }, []);

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    setKeybinding('r', 'refresh');
    return () => removeKeybinding('r');
  }, []);

  // eslint-disable-next-line no-unused-vars
  useInput((input, key) => {
    if (input === 'r') refresh();
  });

  return (
    <Box width={width} height={sectionHeight} flexDirection="row">
      <FileList />
      <StatusDetails />
    </Box>
  );
}

export { AllSections as Status };
