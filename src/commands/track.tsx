import { getRemoteBranchArgs } from '../utils/args';
import { requireCleanStatus, requireRemote } from '../utils/guards';
import { spawnAsync, spawnGitWithColor } from '../utils/commands';
import { gitFetch } from '../utils/git';
import { render } from 'ink';
import { WithProgress } from '../components/withProgress';

export async function track() {
  const { remote, branch } = await getRemoteBranchArgs();
  requireRemote(remote);

  const { code } = await spawnAsync('git', ['show-ref', '--branches', branch]);
  if (!code) {
    console.warn(`Branch '${branch}' already exists.`);
    process.exit(1);
  }

  await requireCleanStatus();

  const fetch = gitFetch(remote, branch);
  render(<WithProgress msg={`Fetching branch ${branch} from ${remote}`} promise={fetch} />);
  await fetch;

  await spawnGitWithColor(['switch', '-c', branch, '--track', `${remote}/${branch}`]);
}
