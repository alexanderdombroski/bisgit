import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Section } from '../../components/section';
import { Box, Text, useInput } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { useScrollable } from '../../components/hooks/useScrollable';
import { useResolved } from '../../components/hooks/useResolved';
import { useNav } from '../../components/navigation';
import type { Mode } from './modes';
import { useTruncationMode } from '../../components/hooks/useTruncationMode';

type LogProps = {
  setSha: Dispatch<SetStateAction<string | undefined>>;
  mode: Mode;
};

export function Log({ setSha, mode }: LogProps) {
  const { label: currentMode, value: logGetter } = mode;
  const { sectionHeight } = useDimensions();
  const { activeSection, isLocked } = useNav();

  const { mode: truncateMode } = useTruncationMode();

  const { resolved, value: items = [] } = useResolved(logGetter, [currentMode]);

  const {
    scrollUp,
    scrollDown,
    outList: logItems,
    selectedValue,
  } = useScrollable(items, sectionHeight - 2);
  const selectedSha = selectedValue?.sha;

  useEffect(() => {
    setSha(selectedSha);
  }, [selectedSha]);

  useInput((input, key) => {
    if (activeSection !== 'Log' || isLocked) return;

    if (key.upArrow) {
      scrollUp();
    } else if (key.downArrow) {
      scrollDown();
    }
  });

  return (
    <Section overflowY="hidden" height="100%" title="Log" width="50%">
      {resolved &&
        logItems.map(({ sha, message }) => (
          <Box key={`${sha}-${mode}`} flexDirection="row" flexWrap="nowrap">
            <Box minWidth={2}>{sha === selectedSha ? <Text>{'> '}</Text> : null}</Box>
            <Box minWidth={8}>
              <Text color="yellow">{sha}</Text>
            </Box>
            <Box>
              <Text wrap={truncateMode}>{message}</Text>
            </Box>
          </Box>
        ))}
    </Section>
  );
}
