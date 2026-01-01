import { commitsAhead, commitsBehind, getCurrentBranch, isDiffClean } from '../utils/git';
import { requireNotDetached, requireRemote, requireUpstreamBranch } from '../utils/guards';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { savepoint } from './savepoint';
import { nanoid } from 'nanoid';
import { render } from 'ink';
import { WithProgress } from '../components/withProgress';

const execAsync = promisify(exec);

export async function yank() {
	await requireNotDetached();

	const remote = process.argv[3] ?? 'origin';
	requireRemote(remote);

	const branch = await getCurrentBranch();
	requireUpstreamBranch(branch);

	const performYank = async () => {
		const tasks: Promise<any>[] = [execAsync(`git fetch ${remote} ${branch} --force`)];
		if (!(await isDiffClean())) {
			tasks.push(savepoint());
		}

		await Promise.all(tasks);

		const [ahead, behind] = await Promise.all([
			commitsAhead(remote, branch),
			commitsBehind(remote, branch),
		]);

		if (ahead === 0 && behind === 0) {
			return;
		}

		if (ahead !== 0) {
			const backup = `${branch}-${nanoid(8)}`;
			console.info(`Created branch ${backup}`);
			await execAsync(`git branch ${backup}`);
		}

		await execAsync(`git reset --hard ${remote}/${branch}`);
	};

	render(
		<WithProgress msg={`Force pull reseting ${branch} -> ${remote}`} promise={performYank()} />
	);
}
