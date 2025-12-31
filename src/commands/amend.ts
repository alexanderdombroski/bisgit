import { getArgList } from '../utils/args';
import { spawnCommand } from '../utils/commands';

export function amend() {
	spawnCommand('git', ['commit', '--amend', '--no-edit', ...getArgList()], {
		stdio: 'inherit',
		silent: true,
		triggerExit: true,
	});
}
