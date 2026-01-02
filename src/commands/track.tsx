import { getRemoteBranchArgs } from '../utils/args';
import { requireCleanStatus, requireRemote } from '../utils/guards';
import { spawnGitWithColor } from '../utils/commands';
import { gitFetch } from '../utils/git';
import { render } from 'ink';
import { WithProgress } from '../components/withProgress';

export async function track() {
  const { remote, branch } = await getRemoteBranchArgs();
  requireRemote(remote);
  await requireCleanStatus();

  const fetch = gitFetch(remote, branch);
  render(<WithProgress msg={`Fetching branch ${branch} from ${remote}`} promise={fetch} />);
  await fetch;

  await spawnGitWithColor(['switch', '-c', branch, '--track', `${remote}/${branch}`]);
}
