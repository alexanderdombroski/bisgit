import { spawnSync } from 'node:child_process';
import { exists } from './fs';
import { isHeadDetached } from './git';

function requireZeroStatus(cmd: string, args: string[], errorMessage?: string) {
	const { status } = spawnSync(cmd, args, { stdio: 'ignore' });
	if (status !== 0) {
		errorMessage && console.error(errorMessage);
		process.exit(1);
	}
}

/** Exits 1 if no not git repository */
export const requireGitRepo = () =>
	requireZeroStatus('git', ['rev-parse', '--git-dir'], 'Need to use command in a git repository.');

/** Exits 1 if no root commit */
export const requireRootCommit = () =>
	requireZeroStatus('git', ['rev-parse', 'HEAD'], 'Need to create first commit.');

/** Exits 1 if no origin remote */
export const requireRemote = (name = 'origin') =>
	requireZeroStatus('git', ['remote', 'get-url', name], `Need to add remote '${name}'.`);

export const requireBranch = (name: string) =>
	requireZeroStatus(
		'git',
		['show-ref', '--branches', name],
		`Branch '${name}' isn't tracked locally and may not exist.`
	);

/** Exits 1 if there are untracked or staged files */
export const requireCleanStatus = () => {
	const msg = 'You should stash or commit your changes first.';
	requireZeroStatus('git', ['diff', '--quiet'], msg);
	requireZeroStatus('git', ['diff', '--cached', '--quiet'], msg);
};

/** Exits 1 if file doesn't exist */
export const requireFileExists = async (fp: string) => {
	if (!(await exists(fp))) {
		console.error(`${fp} must exist for this operation and it doesn't for some reason`);
		process.exit(1);
	}
};

/** Exits 1 if in detached HEAD */
export const requireNotDetached = async () => {
	if (await isHeadDetached()) {
		console.error("Operation not allowed in a 'detached HEAD' state");
		process.exit(1);
	}
};

/** Exits 1 if no upstream branch */
export const requireUpstreamBranch = (name: string) =>
	requireZeroStatus(
		'git',
		['rev-parse', '--abbrev-ref', '--symbolic-full-name', `${name}@{u}`],
		`branch '${name}' has no upstream`
	);

export function requireArg(msg = 'Error: missing required argument'): string {
	if (process.argv[3]) return process.argv[3];
	console.error(msg);
	process.exit(1);
}

export async function requireStaged() {
	const { status } = spawnSync('git', ['diff', '--staged', '--quiet'], { stdio: 'ignore' });
	if (status === 0) {
		console.error('You have no staged changes');
		process.exit(1);
	}
}
