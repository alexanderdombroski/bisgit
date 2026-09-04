import { execAsync } from '../commands';

export type Worktree = {
  path: string;
  head: string;
  branch?: string;
  detached: boolean;
};

export async function parseWorktreesPorcelain(): Promise<Worktree[]> {
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
