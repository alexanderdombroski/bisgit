import { lazy, Suspense, useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import { KeybindingsProvider, useKeybindings } from '../components/hooks/useKeybindings';
import { Section } from '../components/section';
import { Fallback } from '../components/fallback';

const Log = lazy(() => import('./log'));
// const Status = lazy(() => import('./status'));

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
        <Suspense fallback={<Fallback />}>
          <Log />
        </Suspense>
        <Section flexDirection="row" borderStyle="round" title="Key Shortcuts">
          {Object.entries(keybindings).map(([key, action]) => (
            <Text key={action}>{`[${key}]: ${action}`}</Text>
          ))}
        </Section>
      </Box>
    </KeybindingsProvider>
  );
}
