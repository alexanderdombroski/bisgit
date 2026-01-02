import { normalize } from 'node:path';
import { execAsync, spawnAsync } from './commands';

export async function getCurrentBranch() {
  const { stdout } = await execAsync('git branch --show-current');
  return stdout.trim();
}

export async function getBranchDefaultRemote(name?: string) {
  name ??= await getCurrentBranch();
  const { stdout } = await execAsync(`git config --get branch.${name}.remote`);
  return stdout.trim();
}

/** @note run git fetch before comparing */
export async function commitsAhead(remote: string, branch: string): Promise<number> {
  try {
    const { stdout } = await execAsync(`git rev-list --count ${remote}/${branch}..${branch}`);
    return parseInt(stdout.trim(), 10);
  } catch (error) {
    console.error('Error getting commits ahead:', error);
    return NaN;
  }
}

/** @note run git fetch before comparing */
export async function commitsBehind(remote: string, branch: string): Promise<number> {
  try {
    const { stdout } = await execAsync(`git rev-list --count ${branch}..${remote}/${branch}`);
    return parseInt(stdout.trim(), 10);
  } catch (error) {
    console.error('Error getting commits behind:', error);
    return NaN;
  }
}

export async function getGitConfigPath(file: string) {
  const { stdout } = await execAsync(`git rev-parse --git-path ${file}`);
  return normalize(stdout.trim());
}

export async function getGitDir() {
  const { stdout } = await execAsync('git rev-parse --git-dir');
  return normalize(stdout.trim());
}

export async function isValidRemote(name: string): Promise<boolean> {
  const { code } = await spawnAsync('git', ['remote', 'get-url', name], { stdio: 'ignore' });
  return code === 0;
}

export async function isHeadDetached() {
  const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD');
  return stdout.trim() === 'HEAD';
}

export async function gitFetch(remote?: string, branch?: string) {
  let cmd = 'git fetch';
  if (remote) cmd += ` ${remote}`;
  if (branch) cmd += ` ${branch}`;

  await execAsync(cmd);
}

export async function isDiffClean() {
  const { stdout } = await spawnAsync('git', ['status', '--porcelain']);
  return !stdout?.trim();
}

export async function getStatusPorcelain(): Promise<string[] | undefined> {
  const { stdout } = await spawnAsync('git', ['status', '--porcelain']);
  return stdout?.trim()?.split(/\r?\n/);
}

export async function getMergeBase(ref1: string, ref2: string) {
  const { stdout } = await execAsync(`git merge-base ${ref1} ${ref2}`);
  return stdout.trim();
}

export async function canMerge(from: string, into: string): Promise<boolean> {
  const base = await getMergeBase(from, into);
  const { stdout } = await spawnAsync('git', ['merge-tree', base, into, from]);
  const lines = stdout?.split(/\r?\n/);
  return !lines?.includes('+=======');
}

export async function revParse(ref: string): Promise<string> {
  const { stdout } = await execAsync(`git rev-parse ${ref}`);
  return stdout.trim();
}

export async function revList(ref1: string, ref2: string, reverse?: boolean): Promise<string[]> {
  const { stdout } = await execAsync(`git rev-list ${reverse ? '--reverse' : ''} ${ref1}..${ref2}`);
  return stdout.trim().split(/\r?\n/);
}
