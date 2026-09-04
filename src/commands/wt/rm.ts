import path from 'node:path';
import { getArgList } from '../../utils/args';
import { spawnGitWithColor } from '../../utils/commands';
import { getGitCommonDir } from '../../utils/git';
import { parseWorktreesPorcelain } from '../../utils/git/worktrees';

export async function rm() {
  const [, target, ...rest] = getArgList();
  if (!target) {
    console.error('Error: missing worktree or branch argument to remove');
    process.exit(1);
  }

  const [worktrees, commonDir] = await Promise.all([parseWorktreesPorcelain(), getGitCommonDir()]);

  const targetPath = path.resolve(target);
  const mainWorktreeDir = path.dirname(path.resolve(commonDir));

  // Find matching worktree by path or branch name (supporting refs/heads/ prefix or bare branch name)
  const match = worktrees.find((wt) => {
    if (path.resolve(wt.path) === targetPath) return true;
    if (!wt.branch) return false;
    const branchName = wt.branch.replace(/^refs\/heads\//, '');
    return branchName === target || wt.branch === target;
  });

  if (!match) {
    throw new Error(
      `No worktree found matching "${target}". If it is a branch, it is not paired with a worktree.`
    );
  }

  if (path.resolve(match.path) === mainWorktreeDir) {
    throw new Error(`Cannot remove the main working tree: ${match.path}`);
  }

  const exitCode = await spawnGitWithColor(['worktree', 'remove', match.path, ...rest]);
  if (exitCode.code !== 0) {
    process.exit(exitCode.code ?? 1);
  }

  console.info(`Removed worktree ${match.path}`);

  if (match.branch) {
    const branchName = match.branch.replace(/^refs\/heads\//, '');
    await spawnGitWithColor(['branch', '-D', branchName]);
  }
}
