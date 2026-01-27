import { Box, Text } from 'ink';
import type { Dispatch, SetStateAction } from 'react';
import { Section } from '../../components/section';
import { parseStdoutByLine } from '../../utils/commands';
import { useResolved } from '../../components/hooks/useResolved';
import { useScrollable } from '../../components/hooks/useScrollable';
import { useDimensions } from '../../components/hooks/useDimensions';
import { useTruncationMode } from '../../components/hooks/useTruncationMode';
import { useEffect } from 'react';

type StashesProps = {
  setStash: Dispatch<SetStateAction<string | undefined>>;
};

export function Stashes({ setStash }: StashesProps) {
  const { sectionHeight } = useDimensions();
  const { mode } = useTruncationMode();

  const { value: allStashes = [] } = useResolved(getStashList);
  const {
    outList: stashList,
    selectedValue,
    selectedIndex,
  } = useScrollable(allStashes, sectionHeight - 2);

  useEffect(() => {
    setStash(`stash@{${selectedIndex}}`);
  }, [selectedIndex]);

  return (
    <Section title="Stashes" width="50%" height="100%">
      {stashList.map((stash) => (
        <Box key={stash} flexDirection="row" flexWrap="nowrap">
          <Box minWidth={2}>{stash === selectedValue ? <Text>{'> '}</Text> : null}</Box>
          <Text wrap={mode}>{stash}</Text>
        </Box>
      ))}
    </Section>
  );
}

async function getStashList() {
  return await parseStdoutByLine(`git stash list`);
}
