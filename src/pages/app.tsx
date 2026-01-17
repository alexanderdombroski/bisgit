import { lazy, useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import { useKeybindings } from '../components/hooks/useKeybindings';
import { useDimensions } from '../components/hooks/useDimensions';
import { NavigationHeader, useNav } from '../components/navigation';

const Status = lazy(() => import('./status'));
const Log = lazy(() => import('./log'));

export function App() {
  const { prevSection, nextSection, activeGroup, setActiveGroup } = useNav();

  useInput((input, key) => {
    if (key.tab && key.shift) {
      prevSection();
    } else if (key.tab) {
      nextSection();
    } else if (input.toLowerCase() === 'q') {
      process.exit();
    } else if (input === '1') {
      setActiveGroup('Status');
    } else if (input === '2') {
      setActiveGroup('Log');
    }
  });

  const deminsions = useDimensions();

  const { keybindings, setKeybinding } = useKeybindings();
  useEffect(() => setKeybinding('q', 'quit'), []);

  return (
    <Box flexDirection="column" {...deminsions}>
      <NavigationHeader />
      {activeGroup === 'Log' && <Log />}
      {activeGroup === 'Status' && <Status />}
      <Box flexDirection="row">
        {Object.entries(keybindings).map(([key, action]) => (
          <Text key={action}>{`[${key}]: ${action} `}</Text>
        ))}
      </Box>
    </Box>
  );
}
