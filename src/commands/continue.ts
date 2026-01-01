import { getConflictTypes } from '../utils/conflict';
import { spawnGitWithColor } from '../utils/commands';

export async function continueHandler() {
	const { merge, rebaseMerge, rebaseApply, cherryPick, revert } = await getConflictTypes();
	let type = '';
	if (merge) {
		type = 'merge';
	} else if (rebaseMerge || rebaseApply) {
		type = 'rebase';
	} else if (cherryPick) {
		type = 'cherry-pick';
	} else if (revert) {
		type = 'revert';
	} else {
		console.log('Nothing to continue.');
		return;
	}

	console.log(`Continuing the ${type}`);
	await spawnGitWithColor([type, '--continue']);
}
