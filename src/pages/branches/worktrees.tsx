import { Text } from 'ink';
import { Section } from '../../components/section';
import { useResolved } from '../../components/hooks/useResolved';
import { Fragment } from 'react';
import { useDimensions } from '../../components/hooks/useDimensions';
import { parseWorktreesPorcelain } from '../../utils/git/worktrees';

export function Worktrees() {
  const { sectionHalfHeight } = useDimensions();

  const { value: worktrees } = useResolved(parseWorktreesPorcelain);

  return (
    <Section width="100%" title="Worktrees" innerHeight={sectionHalfHeight - 1}>
      {worktrees?.map(({ branch, detached, path, head }) => (
        <Fragment key={path}>
          <Text>{detached ? head : branch}</Text>
          <Text>{path}</Text>
          <Text> </Text>
        </Fragment>
      ))}
    </Section>
  );
}
