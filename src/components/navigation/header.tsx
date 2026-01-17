import { Box, Text } from 'ink';
import { useNav, sections } from './useNav';

const sectionGroups = Array.from(new Set(Object.values(sections)));

export function NavigationHeader() {
  const { activeGroup } = useNav();

  return (
    <Box width="100%" flexDirection="row">
      {sectionGroups.map((group, i) => (
        <Box
          key={group}
          borderStyle="classic"
          borderLeft={!!i}
          borderRight={false}
          borderTop={false}
          borderBottom={false}
        >
          <Text color={group === activeGroup ? 'cyan' : ''}>{` [${i + 1}]: ${group} `}</Text>
        </Box>
      ))}
    </Box>
  );
}
