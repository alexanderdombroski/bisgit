import { execSync } from 'node:child_process';

/** Returns the root of the repo or worktree */
export function getGitDir(): string {
	return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
}

/** Handler for pwd */
export function pwd() {
	const pwd = getGitDir();
	console.log(pwd);
}
