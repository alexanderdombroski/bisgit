import { useCallback, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Section } from '../../components/section';
import { Box, Text, useInput } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { useScrollable } from '../../components/hooks/useScrollable';
import { useResolved } from '../../components/hooks/useResolved';
import { useNav } from '../../components/navigation';
import type { LogEntry, Mode } from './modes';
import { useTruncationMode } from '../../components/hooks/useTruncationMode';
import { useTreeNavigation } from '../files/useTreeNavigation';

type LogProps = {
  setSha: Dispatch<SetStateAction<string | undefined>>;
  mode: Mode;
};

export function Log({ setSha, mode }: LogProps) {
  const { label: currentMode, value: modeGetter } = mode;
  const { sectionHeight } = useDimensions();
  const { activeSection, isLocked } = useNav();
  const { selectedFile } = useTreeNavigation();

  const { mode: truncateMode } = useTruncationMode();

  const logGetter = useCallback(() => {
    if (modeGetter.length && selectedFile) {
      return modeGetter(selectedFile);
    } else {
      return (modeGetter as () => Promise<LogEntry[]>)();
    }
  }, [modeGetter, selectedFile]);

  const { resolved, value: items = [] } = useResolved(logGetter, [currentMode]);

  const {
    scrollUp,
    scrollDown,
    outList: logItems,
    selectedValue,
    renderedIndex,
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

  const isNonUniqueShaMode = nonUniqueShaLogs.includes(mode.label);

  return (
    <Section overflowY="hidden" height="100%" title="Log" width="50%">
      {resolved &&
        logItems.map(({ sha, message }, i) => (
          <Box
            key={`${sha}-${mode.label}${isNonUniqueShaMode ? i : ''}`}
            flexDirection="row"
            flexWrap="nowrap"
          >
            <Box minWidth={2}>
              {sha === selectedSha ? (
                <Text color={isNonUniqueShaMode && i === renderedIndex ? 'magenta' : undefined}>
                  {'> '}
                </Text>
              ) : null}
            </Box>
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

const nonUniqueShaLogs: Mode['label'][] = ['blame', 'reflog'];
