import { getArgList } from '../utils/args';
import { spawnCommand } from '../utils/commands';

/**
TODO - This doesn't fully work with git stash -u
Need to run this command to see untracked files
git ls-tree -r --name-only stash@{0}^3 
*/

export function files() {
	spawnCommand('git', ['show', '--name-only', '--pretty=format:', ...getArgList()], {
		stdio: 'inherit',
		silent: true,
		triggerExit: true,
	});
}
