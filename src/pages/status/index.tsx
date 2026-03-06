import { Box, useInput } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { FileList } from './fileList';
import { StatusDetails } from './statusDetails';
import { useStatus } from '../../components/hooks/useStatus';
import { useEffect } from 'react';
import { useKeybindings } from '../../components/hooks/useKeybindings';
import { ModalInput, useModal } from '../../components/modal';
import { useErrorCatcher } from '../../components/hooks/useErrorCatcher';
import { execAsync } from '../../utils/commands';

function AllSections() {
  const { width, sectionHeight } = useDimensions();
  const { status, refresh } = useStatus();

  useEffect(() => {
    refresh();
  }, []);

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    setKeybinding('r', 'refresh');
    setKeybinding('c', 'commit');
    return () => removeKeybinding(['r', 'c']);
  }, []);

  const { setModal, open } = useModal();
  const { attempt } = useErrorCatcher();

  const handleCommit = (msg: string) => {
    msg = msg.trim();
    if (!msg) return;
    attempt(async () => {
      if (!status.find(({ staged }) => staged)) throw new Error('Nothing to commit');
      await execAsync(`git commit -m "${msg}"`);
      refresh();
    });
  };

  // eslint-disable-next-line no-unused-vars
  useInput((input, key) => {
    if (input === 'r') refresh();
    else if (input === 'c') {
      setModal(<ModalInput title="Commit Message" handleSubmit={handleCommit} width={54} />);
      open();
    }
  });

  return (
    <Box width={width} height={sectionHeight} flexDirection="row">
      <FileList />
      <StatusDetails />
    </Box>
  );
}

export { AllSections as Status };
