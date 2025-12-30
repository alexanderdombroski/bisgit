import { isGit } from './git';
import { isGh } from './gh';
import { spawnCommand } from '../utils/commands';

const runExternalCommand = (cmd: string) => {
	spawnCommand(cmd, process.argv.slice(2), { stdio: 'inherit', silent: true });
};

export async function runWrapper(cmd: string): Promise<boolean | undefined> {
	if (isGit(cmd)) {
		runExternalCommand('git');
		return true;
	} else if (isGh(cmd)) {
		runExternalCommand('gh');
		return true;
	}

	return false;
}
