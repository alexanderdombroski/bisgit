import { exec } from 'node:child_process';
import { normalize } from 'node:path';
import { promisify } from 'node:util';
import { spawnAsync } from './commands';

const execAsync = promisify(exec);

export async function getCurrentBranch() {
	const { stdout } = await execAsync('git branch --show-current');
	return stdout.trim();
}

export async function getBranchDefaultRemote(name?: string) {
	name ??= await getCurrentBranch();
	const { stdout } = await execAsync(`git config --get branch.${name}.remote`);
	return stdout.trim();
}

/** @note run git fetch before comparing */
export async function commitsAhead(remote: string, branch: string): Promise<number> {
	try {
		const { stdout } = await execAsync(`git rev-list --count ${remote}/${branch}..${branch}`);
		return parseInt(stdout.trim(), 10);
	} catch (error) {
		console.error('Error getting commits ahead:', error);
		return NaN;
	}
}

/** @note run git fetch before comparing */
export async function commitsBehind(remote: string, branch: string): Promise<number> {
	try {
		const { stdout } = await execAsync(`git rev-list --count ${branch}..${remote}/${branch}`);
		return parseInt(stdout.trim(), 10);
	} catch (error) {
		console.error('Error getting commits behind:', error);
		return NaN;
	}
}

export async function getGitConfigPath(file: string) {
	const { stdout } = await execAsync(`git rev-parse --git-path ${file}`);
	return normalize(stdout.trim());
}

// eslint-disable-next-line no-unused-vars
async function isValidRemote(name: string): Promise<boolean> {
	const { code } = await spawnAsync('git', ['remote', 'get-url', name], { stdio: 'ignore' });
	return code === 0;
}
