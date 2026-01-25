import { Box, useInput } from 'ink';
import { useEffect } from 'react';
import { useDimensions } from '../../components/hooks/useDimensions';
import { useKeybindings } from '../../components/hooks/useKeybindings';
import { useNav } from '../../components/navigation';
import { Tree } from './tree';
import { FileMeta } from './filemeta';
import { useMessaging } from '../../components/hooks/useMessaging';
import { getContents, useTreeNavigation } from './useTreeNavigation';
import { useModal } from '../../components/modal';
import { Alert } from '../../components/modal/alert';

function AllSections() {
  const { width, sectionHeight } = useDimensions();
  const { selectedFile, tree } = useTreeNavigation();

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    setKeybinding('l', 'log');
    setKeybinding('b', 'blame');
    return () => {
      removeKeybinding(['l', 'b']);
    };
  }, []);

  const { setActiveGroup } = useNav();
  const { sendMessage } = useMessaging();
  const { setModal, open } = useModal();
  // eslint-disable-next-line no-unused-vars
  useInput((input, key) => {
    if (input === 'l') {
      sendMessage('log-file');
      setActiveGroup('Log');
    } else if (input === 'b') {
      if (Object.keys(getContents(tree ?? {}, selectedFile as string)).length === 0) {
        sendMessage('blame-file');
        setActiveGroup('Log');
      } else {
        setModal(<Alert title="Sorry" message={["Can't blame a folder."]} />);
        open();
      }
    }
  });

  return (
    <Box width={width} height={sectionHeight}>
      <Tree />
      <FileMeta />
    </Box>
  );
}

export { AllSections as Files };
