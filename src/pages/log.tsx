import { use } from 'react';
import { execAsync } from '../utils/commands';
import { Section } from '../components/section';
import { Box, Text, useInput } from 'ink';
import { useDimensions } from '../components/hooks/useDimensions';
import { useScrollable } from '../components/hooks/useScrollable';

const logPromise = (async () => {
  const { stdout } = await execAsync('git log --oneline -n 30');
  const lines = stdout.trim().split(/\r?\n/);
  return lines.map(splitLogEntry);
})();
const commitPromise = (async () => {
  const { stdout } = await execAsync(`git show HEAD --name-only`);
  return stdout.trim();
})();

export default function Log() {
  const { height, width } = useDimensions();
  const sectionHeight = height - 5;
  const sectionWidth = Math.floor(width / 2);

  const items = use(logPromise);

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

  const details = use(commitPromise);

  return (
    <>
      <Box>
        <Section overflowY="hidden" height={sectionHeight} title="Log" width={sectionWidth}>
          {logItems.map(({ sha, message }) => (
            <Box key={sha} flexDirection="row" flexWrap="nowrap">
              <Box minWidth={2}>{sha === selectedValue.sha ? <Text>{'> '}</Text> : null}</Box>
              <Box minWidth={8}>
                <Text color="yellow">{sha}</Text>
              </Box>
              <Box>
                <Text wrap="truncate-end">{message}</Text>
              </Box>
            </Box>
          ))}
        </Section>
        <Section title="Commit Details" width={sectionWidth}>
          <Text>{details}</Text>
        </Section>
      </Box>
    </>
  );
}

function splitLogEntry(line: string) {
  const firstSpace = line.indexOf(' ');
  return {
    sha: line.slice(0, firstSpace),
    message: line.slice(firstSpace + 1),
  };
}
