import { render } from 'ink';
import { WithProgress } from '../components/withProgress';
import { execAsync } from '../utils/commands';
import { getForkName, getRepoName } from '../utils/git/gh';
import { requireRemote } from '../utils/guards';

export async function syncfork() {
  requireRemote();

  const setupPromise = Promise.all([getRepoName(), getForkName()]);
  render(<WithProgress promise={setupPromise} msg="Getting fork details" />);

  const [repo, fork] = await setupPromise;
  if (!fork.owner) {
    console.error('This is not a fork');
    process.exit(1);
  }

  const promise = execAsync(
    `gh repo sync ${repo.owner}/${repo.repo} --source ${fork.owner}/${fork.repo}`
  );

  render(
    <WithProgress
      promise={promise}
      msg={`Syncing fork ${repo.repo} with upstream ${fork.owner}/${fork.repo}`}
    />
  );
}
