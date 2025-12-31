import { exec } from 'node:child_process';
import {
	commitsAhead,
	commitsBehind,
	getBranchDefaultRemote,
	getCurrentBranch,
} from '../utils/git';
import { requireBranch, requireRemote } from '../utils/guards';
import { render } from 'ink';
import { WithProgress } from '../components/withProgress';
import { spawnCommand, spawnGitWithColor } from '../utils/commands';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

/** Merges `target` -> `destination` */
export async function backmerge() {
	const target = process.argv[3];
	const destination = process.argv[4] ?? (await getCurrentBranch());

	requireBranch(target);
	requireBranch(destination);
	if (target === destination) {
		return console.log(`No reason to merge '${target}' into '${destination}'`);
	}

	const remote = await getBranchDefaultRemote(target);
	requireRemote(remote);

	const merge = async () => {
		// Update target branch
		try {
			await smartPull(remote, target);
		} catch {
			console.error(
				`Error when updating branch ${target} with remote ${remote}. Fix divergent branches before merging into ${destination}`
			);
			return;
		}

		// Merge into destination
		const current = await getCurrentBranch();
		if (current !== destination) {
			await execAsync(`git switch ${destination}`);
		}

		spawnCommand('git', ['merge', target], { stdio: 'inherit', silent: true });
	};

	render(<WithProgress msg="Updating target branch and merging" promise={merge()} />);
}

export async function smartPull(remote: string, branch: string) {
	await execAsync(`git fetch ${remote} ${branch}`);
	const [ahead, behind, current] = await Promise.all([
		commitsAhead(remote, branch),
		commitsBehind(remote, branch),
		getCurrentBranch(),
	]);

	if (behind === 0) return; // Nothing to new to merge in

	if (ahead === 0 && current !== branch) {
		// headless fastforward possible
		await execAsync(`git fetch ${remote} ${branch}:${branch}`);
		return;
	}

	await execAsync(`git switch ${branch}`);
	if (ahead === 0) {
		// fastforward possible
		await execAsync(`git merge ${remote}/${branch}`);
		return;
	}

	// Hope for no merge conflicts
	await spawnGitWithColor(['merge', `${remote}/${branch}`], ['ignore', 'ignore', 'inherit']);
}
