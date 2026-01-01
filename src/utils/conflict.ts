import path from 'node:path';
import { getGitConfigPath, getGitDir } from './git';
import { exists } from './fs';
import { spawnAsync } from './commands';

// eslint-disable-next-line no-unused-vars
async function isMergeConflict(): Promise<boolean> {
	const file = await getGitConfigPath('MERGE_HEAD');
	return await exists(file);
}

// eslint-disable-next-line no-unused-vars
async function isRebaseConflict(): Promise<boolean> {
	const gitDir = await getGitDir();
	return (
		(await exists(path.join(gitDir, 'rebase-merge'))) ||
		(await exists(path.join(gitDir, 'rebase-apply')))
	);
}

// eslint-disable-next-line no-unused-vars
async function isCherryPickConflict(): Promise<boolean> {
	const file = await getGitConfigPath('CHERRY_PICK_HEAD');
	return await exists(file);
}

// eslint-disable-next-line no-unused-vars
async function isRevertConflict(): Promise<boolean> {
	const file = await getGitConfigPath('REVERT_HEAD');
	return await exists(file);
}

// @ts-ignore -- Impliment later if needed
// eslint-disable-next-line no-unused-vars
async function isStashConflict(): Promise<boolean> {}

/**
Possible Conflicts `git status --porcelain`
UU (unmerged) Edited in two different ways
DU File was edited in the stash, but deleted in a recent commit
UD File was deleted in a stash, but edited in a recent commit
*/

export async function hasConflicts(): Promise<boolean> {
	const res = await spawnAsync('git', ['status', '--porcelain']);
	const regex = /^(UU|DU|UD)/;
	return !!res.stdout?.split(/\r?\n/).some((status) => regex.test(status));
}

type ConflictTypes = {
	merge: boolean;
	rebaseMerge: boolean;
	rebaseApply: boolean;
	cherryPick: boolean;
	revert: boolean;
};

/** Detects which Conflict Heads exist */
export async function getConflictTypes(): Promise<ConflictTypes> {
	const dir = await getGitDir();
	const [merge, rebaseMerge, rebaseApply, cherryPick, revert] = await Promise.all([
		await exists(path.join(dir, 'MERGE_HEAD')),
		await exists(path.join(dir, 'rebase-merge')),
		await exists(path.join(dir, 'rebase-apply')),
		await exists(path.join(dir, 'CHERRY_PICK_HEAD')),
		await exists(path.join(dir, 'REVERT_HEAD')),
	]);

	return { merge, rebaseMerge, rebaseApply, cherryPick, revert };
}
