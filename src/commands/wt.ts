import { nanoid } from 'nanoid';
import { getArgList } from '../utils/args';
import { execAsync } from '../utils/commands';
import { requireRootCommit } from '../utils/guards';
import { getRepoName } from '../utils/git/gh';
import { getGitDirRoot } from '../utils/git';
import path from 'node:path';

export async function wt() {
  requireRootCommit();

  const [id = nanoid(8)] = getArgList();
  const { repo } = await getRepoName();
  const wt = `wt-${repo}-${id}`;

  const root = await getGitDirRoot();
  const fp = path.join(path.dirname(root), wt);

  await execAsync(`git worktree add "${fp}" -b ${wt}`);
  console.info(`Created worktree ${wt}`);
}
