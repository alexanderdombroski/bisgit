import { use } from 'react';
import { execAsync } from '../utils/commands';
import { Section } from '../components/section';
import { Box, Text, useInput } from 'ink';
import { useDimensions } from '../components/hooks/useDimensions';
import { useScrollable } from '../components/hooks/useScrollable';

const promise = (async () => {
  const { stdout } = await execAsync('git log --oneline -n 30');
  const lines = stdout.trim().split(/\r?\n/);
  return lines.map(splitLogEntry);
})();

export default function Log() {
  const { height } = useDimensions();
  const sectionHeight = height - 5;

  const items = use(promise);
  const {
    scrollUp,
    scrollDown,
    outList: logItems,
    selectedValue,
  } = useScrollable(items, sectionHeight - 2);

  useInput((input, key) => {
    if (key.upArrow) {
      scrollUp();
    }

    if (key.downArrow) {
      scrollDown();
    }
  });

  return (
    <Section overflowY="hidden" height={sectionHeight}>
      {logItems.map(({ sha, message }) => (
        <Box key={sha} flexDirection="row">
          {sha === selectedValue.sha ? <Text>{'> '}</Text> : <Text>{'  '}</Text>}
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
