import { Box, Text, useInput } from 'ink';
import { Section } from '../../components/section';
import { useModalControls, ModalInput } from '../../components/modal';
import { useNav } from '../../components/navigation';
import { execAsync } from '../../utils/commands';
import { useResolved } from '../../components/hooks/useResolved';
import { getBranchList, getCurrentBranch } from '../../utils/git';
import { useDimensions } from '../../components/hooks/useDimensions';
import { useScrollable } from '../../components/hooks/useScrollable';
import { useKeybindings } from '../../components/hooks/useKeybindings';
import { useEffect } from 'react';

export function Branches() {
  const { activeSection, isLocked } = useNav();
  const { sectionHalfHeight } = useDimensions();

  const { value: allBranches = [], refresh } = useResolved(getBranchList);
  const { value: currentBranch, refresh: refreshCurrent } = useResolved(getCurrentBranch);

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    if (activeSection === 'Branches') {
      setKeybinding('s', 'switch');
      return () => {
        removeKeybinding('s');
      };
    }
  }, [activeSection]);

  const {
    outList: branchList,
    selectedValue,
    scrollUp,
    scrollDown,
  } = useScrollable(allBranches, sectionHalfHeight - 2);

  const onCreate = async (answer: string) => {
    await execAsync(`git branch ${answer}`);
    refresh();
  };

  const deleteBranch = async () => {
    await execAsync(`git branch -D ${selectedValue}`);
    refresh();
  };

  const switchBranch = async () => {
    await execAsync(`git switch ${selectedValue}`);
    refresh();
    refreshCurrent();
  };

  const controls = useModalControls();

  useInput((input, key) => {
    if (activeSection !== 'Branches' || isLocked) return;

    if (key.upArrow) {
      scrollUp();
    } else if (key.downArrow) {
      scrollDown();
    } else if (input === 'c') {
      controls.open();
    } else if (input === 'd') {
      deleteBranch();
    } else if (input === 's') {
      switchBranch();
    }
  });

  return (
    <>
      <Section width="100%" title="Branches" innerHeight={sectionHalfHeight - 1}>
        {branchList.map((branch) => (
          <Box key={branch} flexDirection="row" flexWrap="nowrap">
            <Box minWidth={2}>{branch === selectedValue ? <Text>{'> '}</Text> : null}</Box>
            <Box minWidth={8}>
              <Text color={branch === currentBranch ? 'magenta' : undefined}>{branch}</Text>
            </Box>
          </Box>
        ))}
      </Section>
      <ModalInput title="Name your new branch" handleSubmit={onCreate} modalControls={controls} />
    </>
  );
}
