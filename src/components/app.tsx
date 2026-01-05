import { useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import { KeybindingsProvider, useKeybindings } from './hooks/useKeybindings';
import { Section } from './section';

export function App() {
  // eslint-disable-next-line no-unused-vars
  useInput((input, key) => {
    if (input === 'q') {
      process.exit();
    }
  });

  const { keybindings, setKeybinding } = useKeybindings();
  useEffect(() => setKeybinding('q', 'quit'), []);

  return (
    <KeybindingsProvider>
      <Box flexDirection="column">
        <Section flexDirection="column" borderStyle="round" title="Bisgit" paddingLeft={1}>
          <Text>Git information in here</Text>
          <Text>Logs</Text>
          <Text>Branches</Text>
          <Text>Stash</Text>
        </Section>
        <Section flexDirection="row" borderStyle="round" title="Key Shortcuts">
          {Object.entries(keybindings).map(([key, action]) => (
            <Text key={action}>{`[${key}]: ${action}`}</Text>
          ))}
        </Section>
      </Box>
    </KeybindingsProvider>
  );
}
