import { requireRemote, requireRootCommit } from '../utils/guards';
import { isValidRemote } from '../utils/git';
import { execAsync, spawnAsync } from '../utils/commands';

type RemoteDefault = {
  remote: string;
  branch: string;
};

export async function getRemoteDefault(): Promise<RemoteDefault> {
  requireRootCommit();
  requireRemote();

  const { stdout, code } = await spawnAsync('git', ['rev-parse', '--abbrev-ref', 'origin/HEAD']);

  if (code === 0) {
    return splitRemoteAndBranch(stdout!.trim());
  }

  await execAsync('git remote set-head origin -a');

  const { stdout: unsplit } = await execAsync('git rev-parse --abbrev-ref origin/HEAD');
  return splitRemoteAndBranch(unsplit.trim());
}

/** Handler for remote-default */
export async function remoteDefault() {
  const { remote, branch } = await getRemoteDefault();
  console.log(`Remote default branch is '${remote}/${branch}'`);
}

async function splitRemoteAndBranch(input: string): Promise<RemoteDefault> {
  const parts = input.split('/');
  const possibleRemotes = input.split('/').map((_, i) => parts.slice(0, i + 1).join('/'));
  for (const remote of possibleRemotes) {
    if (await isValidRemote(remote)) {
      const branch = input.slice(remote.length + 1);
      return { remote, branch };
    }
  }
  throw new Error('Failed to get default remote');
}
