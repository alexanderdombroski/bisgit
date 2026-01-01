import { abort } from './abort';
import { amend } from './amend';
import { backmerge } from './backMerge';
import { continueHandler } from './continue';
import { exclude } from './exclude';
import { files } from './files';
import { include } from './include';
import { pwd } from './pwd';
import { remoteDefault } from './remoteDefault';
import { savepoint } from './savepoint';
import { sha } from './sha';
import { track } from './track';
import { yank } from './yank';

const commands: Record<string, () => void | Promise<void>> = {
	abort,
	amend,
	backmerge,
	continue: continueHandler,
	exclude,
	files,
	include,
	pwd,
	'remote-default': remoteDefault,
	savepoint,
	sha,
	track,
	yank,
};

/** returns true if it ran */
export async function runCommand(cmd: string): Promise<boolean | undefined> {
	await commands[cmd]?.();
	return Object.hasOwn(commands, cmd);
}
