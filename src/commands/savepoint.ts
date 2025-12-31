import { exec } from 'node:child_process';
import { getTimestamp } from '../utils/date';
import { promisify } from 'node:util';
import { spawnGitWithColor } from '../utils/commands';

const execAsync = promisify(exec);

export async function savepoint() {
	const timestamp = getTimestamp();
	await execAsync('git add -A');
	await spawnGitWithColor(['commit', '-m', `"WIP ${timestamp}"`]);
}
