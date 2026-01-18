import { abort } from './abort';
import { amend } from './amend';
import { autoprune } from './autoprune';
import { backmerge } from './backMerge';
import { churn } from './churn';
import { coauthor } from './coauthor';
import { codeReview } from './codeReview';
import { conflict } from './conflict';
import { continueHandler } from './continue';
import { exclude } from './exclude';
import { files } from './files';
import { fixup } from './fixup';
import { include } from './include';
import { languages } from './languages';
import { pwd } from './pwd';
import { rebranch } from './rebranch';
import { remoteDefault } from './remoteDefault';
import { savepoint } from './savepoint';
import { sha } from './sha';
import { track } from './track';
import { update } from './update';
import { showVersion } from './version';
import { whoami } from './whoami';
import { wipe } from './wipe';
import { yank } from './yank';

const commands: Record<string, () => void | Promise<void>> = {
  abort,
  amend,
  autoprune,
  backmerge,
  churn,
  coauthor,
  'code-review': codeReview,
  conflict,
  continue: continueHandler,
  exclude,
  files,
  fixup,
  include,
  languages,
  pwd,
  rebranch,
  'remote-default': remoteDefault,
  savepoint,
  sha,
  track,
  update,
  '--version': showVersion,
  whoami,
  wipe,
  yank,
};

/** returns true if it ran */
export async function runCommand(cmd: string): Promise<boolean | undefined> {
  await commands[cmd]?.();
  return Object.hasOwn(commands, cmd);
}
