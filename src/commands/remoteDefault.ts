import { execSync, spawnSync } from 'node:child_process';
import { requireRemote, requireRootCommit } from './guards';

/** Returns origin/HEAD ie 'origin/main' or 'origin/master' */
export function getRemoteDefault(): string {
	requireRootCommit();
	requireRemote();

	const res = spawnSync('git', ['rev-parse', '--abbrev-ref', 'origin/HEAD'], { encoding: 'utf-8' });
	if (res.status === 0) {
		return res.stdout.trim();
	}

	execSync('git remote set-head origin -a', { stdio: 'ignore' });
	return execSync('git rev-parse --abbrev-ref origin/HEAD', { encoding: 'utf-8' }).trim();
}

/** Handler for remote-default */
export function remoteDefault() {
	const remote = getRemoteDefault();
	console.log(`Remote default branch is '${remote}'`);
}
