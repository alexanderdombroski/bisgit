import { render } from 'ink';
import { execAsync, spawnAsync, spawnGitWithColor } from '../utils/commands';
import { requireCleanStatus } from '../utils/guards';
import { smartPull } from './backMerge';
import { getRemoteDefault } from './remoteDefault';
import { WithProgress } from '../components/withProgress';
import { getBranchList, getMergeBase } from '../utils/git';

const RESERVED_BRANCHES = ['master', 'main', 'development', 'lingoport'];

export async function autoprune() {
  await requireCleanStatus();

  const { branch: defaultBranch, remote } = await getRemoteDefault();
  await execAsync(`git switch ${defaultBranch}`);

  const pull = (async () => {
    await spawnGitWithColor(['fetch', '--prune', '--prune-tags']);
    await smartPull(remote, defaultBranch);
  })();
  render(<WithProgress msg="Fetching and pruning remote references" promise={pull} />);
  await pull;

  const branches = await getBranchList();
  for (const branch of branches) {
    if (branch === defaultBranch || RESERVED_BRANCHES.includes(branch)) continue;
    const base = await getMergeBase(branch, defaultBranch);
    const { code } = await spawnAsync('git', ['diff', '--quiet', base, branch]);
    console.log(base, branch, code);
    if (code === 0) {
      await spawnGitWithColor(['branch', '-D', branch]);
    }
  }
}
