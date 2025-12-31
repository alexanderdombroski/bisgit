import { getArgList } from '../utils/cli';
import { spawnCommand } from '../utils/commands';

export function files() {
	spawnCommand('git', ['show', '--name-only', '--pretty=format:', ...getArgList()], {
		stdio: 'inherit',
		silent: true,
		triggerExit: true,
	});
}
