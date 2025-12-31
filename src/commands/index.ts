import { amend } from './amend';
import { backmerge } from './backMerge';
import { files } from './files';
import { remoteDefault } from './remoteDefault';
import { sha } from './sha';

const commands: Record<string, () => void | Promise<void>> = {
	amend,
	backmerge,
	files,
	'remote-default': remoteDefault,
	sha,
};

/** returns true if it ran */
export async function runCommand(cmd: string): Promise<boolean | undefined> {
	await commands[cmd]?.();
	return Object.hasOwn(commands, cmd);
}
