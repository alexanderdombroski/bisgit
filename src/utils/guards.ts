import { spawnSync } from 'node:child_process';
import { exists } from './fs';

function requireZeroStatus(cmd: string, args: string[], errorMessage?: string) {
	const res = spawnSync(cmd, args, { stdio: 'ignore' });
	if (res.status !== 0) {
		errorMessage && console.error(errorMessage);
		process.exit(1);
	}
}

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

export const requireCleanStatus = () => {
	const msg = 'You should stash or commit your changes first.';
	requireZeroStatus('git', ['diff', '--quiet'], msg);
	requireZeroStatus('git', ['diff', '--cached', '--quiet'], msg);
};

export const requireFileExists = async (fp: string) => {
	if (!(await exists(fp))) {
		console.error(`${fp} must exist for this operation and it doesn't for some reason`);
		process.exit(1);
	}
};
