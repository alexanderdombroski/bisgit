import { spawnSync } from 'node:child_process';

function requireZeroStatus(cmd: string, args: string[], errorMessage?: string) {
	const res = spawnSync(cmd, args, { stdio: 'ignore' });
	if (res.status !== 0) {
		errorMessage && console.error(errorMessage);
		process.exit(1);
	}
}

/** Exits 1 if no root commit */
export const requireRootCommit = () =>
	requireZeroStatus('git', ['rev-parse', 'HEAD'], 'Need to create first commit!');

/** Exits 1 if no origin remote */
export const requireRemote = (name = 'origin') =>
	requireZeroStatus('git', ['remote', 'get-url', name], 'Need to add origin remote!');
