import { getTimestamp } from '../utils/date';
import { execAsync, spawnGitWithColor } from '../utils/commands';

export async function savepoint() {
	const timestamp = getTimestamp();
	await execAsync('git add -A');
	await spawnGitWithColor(['commit', '-m', `"WIP ${timestamp}"`]);
}
