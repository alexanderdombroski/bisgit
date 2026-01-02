import { spawn } from 'node:child_process';
import { execAsync, spawnGitWithColor } from '../utils/commands';
import { requireArg, requireStaged } from '../utils/guards';

export async function fixup() {
	const arg = requireArg('Error: missing valid target ref argument');
	await requireStaged();

	const target = await revParse(arg);
	await spawnGitWithColor(['commit', `--fixup=${target}`]);

	const commits = await revList(`${target}^`, 'HEAD');
	const tasks = commits.map((commit) => isRebaseSafe(commit));
	const checks = await Promise.all(tasks);
	if (!checks.every(Boolean)) {
		console.warn('Rebase conflict would occur!');
		await execAsync('git reset HEAD~1 --soft');
		process.exit(1);
	}

	await execAsync(`git rebase -i --autosquash ${target}^`);
}

async function isRebaseSafe(commit: string): Promise<boolean> {
	const { stdout: patch } = await execAsync(`git diff ${commit}^ ${commit}`); // intended not to trim

	const { promise, resolve, reject } = Promise.withResolvers<boolean>();

	const apply = spawn('git', ['apply', '--check', '--3way', '-q'], {
		stdio: ['pipe', 'ignore', 'ignore'],
	});

	apply.on('close', (code) => {
		resolve(code === 0);
	});
	apply.on('error', reject);

	apply.stdin.write(patch);
	apply.stdin.end();

	return promise;
}

async function revParse(ref: string): Promise<string> {
	const { stdout } = await execAsync(`git rev-parse ${ref}`);
	return stdout.trim();
}

async function revList(ref1: string, ref2: string): Promise<string[]> {
	const { stdout } = await execAsync(`git rev-list --reverse ${ref1}..${ref2}`);
	return stdout.trim().split(/\r?\n/);
}
