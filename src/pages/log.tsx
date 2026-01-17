import { useEffect } from 'react';
import { execAsync } from '../utils/commands';
import { Section } from '../components/section';
import { Box, Text, useInput } from 'ink';
import { useDimensions } from '../components/hooks/useDimensions';
import { useScrollable } from '../components/hooks/useScrollable';
import { useKeybindings } from '../components/hooks/useKeybindings';
import { useResolved } from '../components/hooks/useResolved';
import Spinner from 'ink-spinner';
import { useNav } from '../components/navigation';

async function getLog() {
  const { stdout } = await execAsync('git log --oneline -n 30');
  const lines = stdout.trim().split(/\r?\n/);
  return lines.map(splitLogEntry);
}

async function commitDetails(ref?: string) {
  if (!ref) return;
  const { stdout } = await execAsync(`git show ${ref} --name-only`);
  return stdout.trim();
}

export default function Log() {
  const { width, sectionHeight } = useDimensions();

  const { resolved, value: items = [] } = useResolved(getLog);

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

    if (input === 'c') {
      execAsync(`git checkout ${selectedValue.sha}`);
    }
  });

  const { activeSection } = useNav();
  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    if (activeSection === 'Log') {
      setKeybinding('c', 'checkout');
      return () => {
        removeKeybinding('c');
      };
    }
  }, [activeSection]);

  return (
    <>
      <Box width={width}>
        <Section overflowY="hidden" height={sectionHeight} title="Log" width="50%">
          {resolved ? (
            <>
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
            </>
          ) : (
            <Spinner />
          )}
        </Section>
        <CommitDetails sha={selectedValue?.sha} />
      </Box>
    </>
  );
}

function CommitDetails({ sha }: { sha?: string }) {
  const { resolved, value } = useResolved(() => commitDetails(sha), [sha]);
  return (
    <Section title="Commit Details" width="50%" height="100%">
      {sha && resolved ? <Text>{value}</Text> : <Spinner />}
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
