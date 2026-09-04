import os from 'node:os';
import { parseWorktreesPorcelain } from '../../utils/git/worktrees';

export async function ls() {
  const worktrees = await parseWorktreesPorcelain();
  const homeDir = os.homedir();

  // Format paths, replacing home directory with ~/
  const formattedWorktrees = worktrees.map((wt) => {
    let displayPath = wt.path;
    if (displayPath === homeDir) {
      displayPath = '~';
    } else if (displayPath.startsWith(homeDir + '/')) {
      displayPath = '~/' + displayPath.slice(homeDir.length + 1);
    }

    const shortHead = wt.head.slice(0, 7);
    const branchName = wt.branch ? wt.branch.replace(/^refs\/heads\//, '') : '';
    const branchLabel = wt.detached ? '(detached HEAD)' : branchName ? `[${branchName}]` : '';

    return {
      path: displayPath,
      shortHead,
      branchLabel,
    };
  });

  const maxPathLen = Math.max(0, ...formattedWorktrees.map((wt) => wt.path.length));

  for (const wt of formattedWorktrees) {
    const paddedPath = wt.path.padEnd(maxPathLen);
    console.info(`${paddedPath}  ${wt.shortHead} ${wt.branchLabel}`.trimEnd());
  }
}
