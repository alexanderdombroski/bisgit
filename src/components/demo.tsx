import { useState } from 'react';
import { Text, Box, useInput, render } from 'ink';

const App = () => {
  const [count, setCount] = useState(0);

  // eslint-disable-next-line no-unused-vars
  useInput((input, key) => {
    if (input === 'q') {
      process.exit();
    }
    if (input === '+') {
      setCount(count + 1);
    }
    if (input === '-') {
      setCount(count - 1);
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round">
      <Text>👋 Welcome to the Demo Ink App!</Text>
      <Text>---------------------------------</Text>
      <Text>Count: {count}</Text>
      <Text>Press "+" to increase, "-" to decrease</Text>
      <Text>Press "q" to quit</Text>
    </Box>
  );
};

export const renderApp = () => render(<App />);
