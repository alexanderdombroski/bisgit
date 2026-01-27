import { Box, Text, useInput } from 'ink';
import type { Dispatch, SetStateAction } from 'react';
import { Section } from '../../components/section';
import { execAsync, parseStdoutByLine } from '../../utils/commands';
import { useResolved } from '../../components/hooks/useResolved';
import { useScrollable } from '../../components/hooks/useScrollable';
import { useDimensions } from '../../components/hooks/useDimensions';
import { useTruncationMode } from '../../components/hooks/useTruncationMode';
import { useEffect } from 'react';
import { useErrorCatcher } from '../../components/hooks/useErrorCatcher';
import { QuickPick, useModal } from '../../components/modal';

type StashesProps = {
  setStash: Dispatch<SetStateAction<string | undefined>>;
};

export function Stashes({ setStash }: StashesProps) {
  const { sectionHeight } = useDimensions();
  const { mode } = useTruncationMode();
  const { attempt } = useErrorCatcher();
  const { setModal, open } = useModal();

  const { value: allStashes = [], refresh } = useResolved(getStashList);
  const {
    outList: stashList,
    selectedValue,
    selectedIndex,
  } = useScrollable(allStashes, sectionHeight - 2);

  useEffect(() => {
    setStash(`stash@{${selectedIndex}}`);
  }, [selectedIndex]);

  const cmdBuilder = (cmd: string) => async () => {
    await execAsync(`git stash ${cmd} stash@{${selectedIndex}}`);
    refresh();
  };

  // eslint-disable-next-line no-unused-vars
  useInput((input, key) => {
    if (input === 's') {
      setModal(
        <QuickPick
          title="Stash"
          options={[
            { value: 'git stash', label: 'tracked only' },
            { value: 'git stash -u', label: 'tracked & untracked' },
          ]}
          handleSubmit={({ value }) =>
            attempt(async () => {
              await execAsync(value);
              refresh();
            })
          }
        />
      );
      open();
    } else if (input === 'a') {
      attempt(cmdBuilder('apply'));
    } else if (input === 'p') {
      attempt(cmdBuilder('pop'));
    } else if (input === 'd') {
      attempt(cmdBuilder('drop'));
    }
  });

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
