import { Text } from 'ink';
import { Section } from '../../components/section';
import { execAsync } from '../../utils/commands';
import { useResolved } from '../../components/hooks/useResolved';
import { Fragment } from 'react';
import { useDimensions } from '../../components/hooks/useDimensions';

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

type Worktree = {
  path: string;
  head: string;
  branch?: string;
  detached: boolean;
};

async function parseWorktreesPorcelain(): Promise<Worktree[]> {
  const { stdout } = await execAsync('git worktree list --porcelain');
  const lines = stdout.trim().split(/\r?\n/);
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.trim() === '') {
      if (current.length) {
        blocks.push(current);
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current);

  return blocks.map((block) => {
    const wt: Partial<Worktree> = { detached: false };

    for (const line of block) {
      if (line.startsWith('worktree ')) {
        wt.path = line.slice(9);
      } else if (line.startsWith('HEAD ')) {
        wt.head = line.slice(5);
      } else if (line.startsWith('branch ')) {
        wt.branch = line.slice(7);
      } else if (line === 'detached') {
        wt.detached = true;
      }
    }

    return wt as Worktree;
  });
}
