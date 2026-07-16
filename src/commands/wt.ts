import { nanoid } from 'nanoid';
import { getArgList } from '../utils/args';
import { execAsync, spawnAsync } from '../utils/commands';
import { requireRootCommit } from '../utils/guards';
import { getRepoName } from '../utils/git/gh';
import { getGitCommonDir, getGitDirRoot, isAncestor } from '../utils/git';
import path from 'node:path';

export async function wt() {
  requireRootCommit();

  if (getArgList().includes('--sync')) {
    await wtSync();
    return;
  }

  const [id = nanoid(8)] = getArgList();
  const { repo } = await getRepoName();
  const wt = `wt-${repo}-${id}`;

  const root = await getGitDirRoot();
  const fp = path.join(path.dirname(root), wt);

  await execAsync(`git worktree add "${fp}" -b ${wt}`);
  console.info(`Created worktree ${wt}`);
}

type Worktree = {
  path: string;
  branch: string;
};

async function wtSync() {
  const [{ stdout }, commonDir] = await Promise.all([
    execAsync('git worktree list --porcelain'),
    getGitCommonDir(),
  ]);

  const worktrees = stdout
    .trim()
    .split('\n\n')
    .map((block) => ({
      path: block.match(/^worktree (.+)$/m)?.[1],
      branch: block.match(/^branch refs\/heads\/(.+)$/m)?.[1],
    }))
    .filter((wt) => wt.path && wt.branch)
    .filter((wt) => path.resolve(wt.path!) !== path.dirname(path.resolve(commonDir))) as Worktree[];

  if (worktrees.length <= 1) {
    console.error(`There are only ${worktrees.length} worktrees checked out to a branch`);
    process.exit(1);
  }

  // Preflight checks
  for (let i = 0; i < worktrees.length - 1; i++) {
    const from = worktrees[i].branch;
    const to = worktrees[i + 1].branch;
    await checkFastForward(to, from);
  }

  const last = worktrees[worktrees.length - 1].branch;
  for (let i = 0; i < worktrees.length - 1; i++) {
    const to = worktrees[i].branch;
    await checkFastForward(to, last);
  }

  // Merges
  for (let i = 0; i < worktrees.length - 1; i++) {
    await fastForward(worktrees[i + 1].path, worktrees[i].branch);
  }

  // Backmerges
  for (let i = 0; i < worktrees.length - 1; i++) {
    await fastForward(worktrees[i].path, last);
  }

  const { stdout: message } = await spawnAsync('git', ['log', '-1', '--format=%h "%s"']);
  console.info(
    `Fastforwarded all worktrees:\n${worktrees.map((wt) => wt.branch).join('\n')}\n\nTo: ${message}`
  );
}

async function checkFastForward(to: string, from: string) {
  if (!((await isAncestor(to, from)) || (await isAncestor(from, to)))) {
    console.error(`Worktree branches "${from}" and "${to}" cannot be fast forwarded.`);
    process.exit(1);
  }
}

async function fastForward(path: string, sourceBranch: string): Promise<void> {
  await execAsync(`git -C "${path}" merge --ff-only ${sourceBranch}`);
}
