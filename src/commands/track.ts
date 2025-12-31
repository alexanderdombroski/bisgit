import { getRemoteBranchArgs } from '../utils/args';
import { requireRemote } from '../utils/guards';
import { spawnGitWithColor } from '../utils/commands';

export async function track() {
	const { remote, branch } = await getRemoteBranchArgs();
	requireRemote(remote);

	await spawnGitWithColor(['switch', '-c', branch, '--track', `${remote}/${branch}`]);
}
