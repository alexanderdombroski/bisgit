import { useEffect, useState } from 'react';
import { Box, useInput } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { CommitDetails } from './commitDetails';
import { Log } from './log';
import { QuickPick, useModal } from '../../components/modal';
import { type Mode, modes } from './modes';
import { useKeybindings } from '../../components/hooks/useKeybindings';
import { useNav } from '../../components/navigation';
import { execAsync } from '../../utils/commands';
import { useErrorCatcher } from '../../components/hooks/useErrorCatcher';
import { useMessaging } from '../../components/hooks/useMessaging';

export default function AllSections() {
  const { setModal, toggle } = useModal();
  const [sha, setSha] = useState<string>();
  const { width, sectionHeight } = useDimensions();
  const [mode, setMode] = useState<Mode>(modes[0]);

  const { receiveMessage } = useMessaging();
  useEffect(() => {
    if (receiveMessage('log-file')) {
      setMode(modes[4]);
    }
    if (receiveMessage('blame-file')) {
      setMode(modes[5]);
    }
  }, []);

  const { isLocked } = useNav();
  const { attempt } = useErrorCatcher();

  // eslint-disable-next-line no-unused-vars
  useInput((input, key) => {
    if (input === 'm') {
      setModal(
        <QuickPick
          options={modes}
          title="Log Type"
          handleSubmit={(m) => setMode(m as Mode)}
          initialIndex={modes.indexOf(mode)}
        />
      );
      toggle();
    }
    if (isLocked) return;
    if (input === 'c' && sha) {
      attempt(() => execAsync(`git checkout ${sha}`));
    }
  });

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    setKeybinding('c', 'checkout');
    setKeybinding('m', 'mode');
    return () => {
      removeKeybinding(['c', 'm']);
    };
  }, []);

  return (
    <Box width={width} height={sectionHeight}>
      <Log setSha={setSha} mode={mode} />
      <CommitDetails sha={sha} />
    </Box>
  );
}

export { AllSections as Log };
