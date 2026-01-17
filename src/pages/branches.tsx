import { Box, Text, useInput } from 'ink';
import { Section } from '../components/section';
import { useDimensions } from '../components/hooks/useDimensions';
import { useEffect } from 'react';
import { useKeybindings } from '../components/hooks/useKeybindings';
import { useModalControls, ModalInput } from '../components/modal';
import { useNav, type Section as SectionName } from '../components/navigation';
import { execAsync } from '../utils/commands';
import { useResolved } from '../components/hooks/useResolved';
import { getBranchList } from '../utils/git';

const modalPrompts: Partial<Record<SectionName, string>> = {
  Branches: 'Name your new branch',
  Remotes: 'Name your new remote',
  Worktrees: 'Name your new worktree',
};

export default function Branches() {
  const { width, sectionHeight } = useDimensions();
  const controls = useModalControls();
  const { activeSection } = useNav();

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    setKeybinding('c', 'create');
    return () => {
      removeKeybinding('c');
    };
  }, []);

  // eslint-disable-next-line no-unused-vars
  useInput((input, key) => {
    if (input === 'c') {
      controls.open();
    }
  });

  const { value: branchList, refresh } = useResolved(getBranchList);

  const onCreate = async (answer: string) => {
    if (activeSection === 'Branches') {
      await createBranch(answer);
      refresh();
    }
  };

  return (
    <>
      <Box width={width} height={sectionHeight}>
        <Box flexDirection="column" width="50%">
          <Section width="100%" title="Branches">
            {branchList?.map((branch) => (
              <Text key={branch}>{branch}</Text>
            ))}
          </Section>
          <Section width="100%" title="Worktrees">
            <Text>Hello World</Text>
          </Section>
        </Box>
        <Section width="50%" title="Remotes">
          <Text>Hello World</Text>
        </Section>
      </Box>
      <ModalInput
        title={modalPrompts[activeSection] as string}
        handleSubmit={onCreate}
        modalControls={controls}
      />
    </>
  );
}

export async function createBranch(name: string) {
  await execAsync(`git branch ${name}`);
}
