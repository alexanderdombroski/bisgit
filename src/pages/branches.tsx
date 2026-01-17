import { Box, Text } from 'ink';
import { Section } from '../components/section';
import { useDimensions } from '../components/hooks/useDimensions';
import { useEffect } from 'react';
import { useKeybindings } from '../components/hooks/useKeybindings';

export default function Branches() {
  const { width, sectionHeight } = useDimensions();

  const { setKeybinding, removeKeybinding } = useKeybindings();
  useEffect(() => {
    setKeybinding('c', 'create');
    return () => {
      removeKeybinding('c');
    };
  }, []);

  return (
    <Box width={width} height={sectionHeight}>
      <Box flexDirection="column" width="50%">
        <Section width="100%" title="Branches">
          <Text>Hello World</Text>
        </Section>
        <Section width="100%" title="Worktrees">
          <Text>Hello World</Text>
        </Section>
      </Box>
      <Section width="50%" title="Remotes">
        <Text>Hello World</Text>
      </Section>
      {/* <Text>Hi</Text> */}
    </Box>
  );
}
