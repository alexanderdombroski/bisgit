import { getConflictTypes, hasConflicts } from '../utils/conflict';
import { spawnGitWithColor } from '../utils/commands';

export async function abort() {
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
		const msg = (await hasConflicts())
			? 'Conflicts exist, but likely are from a stash and are not abortable. Resolve them manually.'
			: 'Nothing to abort.';
		console.log(msg);
		return;
	}

	console.log(`Aborting the ${type}`);
	await spawnGitWithColor([type, '--abort']);
}
