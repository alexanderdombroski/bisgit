import { use, useState } from 'react';
import { execAsync } from '../utils/commands';
import { Section } from '../components/section';
import { Box, Text, useInput } from 'ink';
import { useDimensions } from '../components/hooks/useDimensions';

const promise = (async () => {
  const { stdout } = await execAsync('git log --oneline -n 30');
  const lines = stdout.trim().split(/\r?\n/);
  return lines.map(splitLogEntry);
})();

export default function Log() {
  const items = use(promise);

  const [offset, setOffset] = useState(0);
  const { height } = useDimensions();
  const SECTION_HEIGHT = height - 5;
  useInput((input, key) => {
    if (key.upArrow) {
      setOffset((o) => Math.max(0, o - 1));
    }

    if (key.downArrow) {
      setOffset((o) => Math.min(items.length - height, o + 1));
    }
  });

  const visibleLines = items.slice(offset, offset + height);

  return (
    <Section overflowY="hidden" height={SECTION_HEIGHT}>
      {visibleLines.map(({ sha, message }) => (
        <Box key={sha} flexDirection="row">
          <Text color="yellow">{sha}&nbsp;</Text>
          <Text>{message}</Text>
        </Box>
      ))}
    </Section>
  );
}

function splitLogEntry(line: string) {
  const firstSpace = line.indexOf(' ');
  return {
    sha: line.slice(0, firstSpace),
    message: line.slice(firstSpace + 1),
  };
}
