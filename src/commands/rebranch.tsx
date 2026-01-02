import { render } from 'ink';
import { execAsync } from '../utils/commands';
import { canMerge, getCurrentBranch, isDiffClean, revList } from '../utils/git';
import { smartPull } from './backMerge';
import { getRemoteDefault } from './remoteDefault';
import { savepoint } from './savepoint';
import { WithProgress } from '../components/withProgress';
import { nanoid } from 'nanoid';
import chalk from 'chalk';

export async function rebranch() {
  const { remote, branch: defaultBranch } = await getRemoteDefault();
  const source = process.argv[3] ?? defaultBranch;

  if (!(await isDiffClean())) {
    await savepoint();
  }

  if (!(await canMerge(source, 'HEAD'))) {
    console.warn('Conflicts would occur. Not safe to rebranch.');
    process.exit(1);
  }

  const branch = await getCurrentBranch();

  const update = (async () => {
    await smartPull(remote, source);
  })();
  render(<WithProgress msg={`Updating branch ${source}`} promise={update} />);
  await update;

  const temp = `${nanoid(8)}`;

  const backup = (async () => {
    await execAsync(`git switch ${branch}`);
    await execAsync(`git branch ${temp}`);
    await execAsync(`git switch ${source}`);
    await execAsync(`git branch -D ${branch}`);
    await execAsync(`git switch -c ${branch}`);
    const commits = await revList(source, temp, true);
    for (const commit of commits) {
      try {
        await execAsync(`git cherry-pick ${commit}`);
      } catch {
        const undo = chalk.yellow(`git branch -D ${branch} && git branch -m ${temp} ${branch}`);
        throw new Error(
          `❌ cherry pick failed at ${commit}\nRun this to restore backup branch\n > ${undo}`
        );
      }
    }
    await execAsync(`git branch -D ${temp}`);
  })();

  render(<WithProgress msg={`Rewriting branch ${branch}`} promise={backup} />);
  await backup;

  console.info(`Successfully recreated branch ${branch} from ${source}`);
}
