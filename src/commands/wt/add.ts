import { nanoid } from 'nanoid';
import { getArgList } from '../../utils/args';
import { execAsync } from '../../utils/commands';
import { requireRootCommit } from '../../utils/guards';
import { getGitCommonDir, getGitDirRoot } from '../../utils/git';
import path from 'node:path';

export async function add() {
  requireRootCommit();

  const [arg1, arg2] = getArgList();
  const id = (arg1 === 'add' ? arg2 : arg1) || nanoid(8);

  const [root, commonDir] = await Promise.all([getGitDirRoot(), getGitCommonDir()]);

  // Main repo directory is the parent of .git common dir (or git dir root)
  const repoDir = path.dirname(path.resolve(commonDir));
  const repo = path.basename(repoDir);
  const wt = `wt-${repo}-${id}`;

  const fp = path.join(path.dirname(root), wt);

  await execAsync(`git worktree add "${fp}" -b ${wt}`);
  console.info(`Created worktree ${wt}`);
}
