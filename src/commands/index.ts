import { backmerge } from './backMerge';
import { remoteDefault } from './remoteDefault';
import { sha } from './sha';

const commands: Record<string, () => void | Promise<void>> = {
	'remote-default': remoteDefault,
	sha,
	backmerge,
};

/** returns true if it ran */
export async function runCommand(cmd: string): Promise<boolean | undefined> {
	await commands[cmd]?.();
	return Object.hasOwn(commands, cmd);
}
