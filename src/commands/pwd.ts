import { execSync } from 'node:child_process';

/** Returns the root of the repo or worktree */
function getGitDirRoot(): string {
	return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
}

/** Handler for pwd */
export function pwd() {
	const pwd = getGitDirRoot();
	console.log(pwd);
}
