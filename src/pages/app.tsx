import { useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import { useKeybindings } from '../components/hooks/useKeybindings';
import { useDimensions } from '../components/hooks/useDimensions';
import { NavigationHeader, Router, useNav } from '../components/navigation';

export function App() {
  const { isLocked, activeGroup } = useNav();

  // eslint-disable-next-line no-unused-vars
  useInput((input, key) => {
    if (isLocked) return;
    if (input.toLowerCase() === 'q') {
      process.exit();
    }
  });

  const deminsions = useDimensions();

  const { keybindings, setKeybinding } = useKeybindings();
  useEffect(() => setKeybinding('q', 'quit'), []);

  return (
    <Box flexDirection="column" {...deminsions}>
      <NavigationHeader activeGroup={activeGroup} />
      <Router />
      <Box flexDirection="row">
        {Object.entries(keybindings).map(([key, action]) => (
          <Text key={action}>{`[${key}]: ${action} `}</Text>
        ))}
      </Box>
    </Box>
  );
}
