import { Box, Text } from 'ink';
import { sections } from './useNav';
import { memo } from 'react';

const sectionGroups = Array.from(new Set(Object.values(sections)));

export const NavigationHeader = memo<{ activeGroup: string }>(
  ({ activeGroup }) => {
    return (
      <Box width="100%" flexDirection="row" height={1}>
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
  },
  (prev, next) => prev.activeGroup === next.activeGroup
);
