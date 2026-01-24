import { normalize } from 'node:path';
import { execAsync, parseStdoutByLine, spawnAsync } from './commands';

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

/** Returns the root of the repo or worktree */
export async function getGitDirRoot(): Promise<string> {
  const { stdout } = await execAsync('git rev-parse --show-toplevel');
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

export async function isDiffClean(): Promise<boolean> {
  const { stdout } = await spawnAsync('git', ['status', '--porcelain']);
  return !stdout?.trim();
}

export async function getStatusPorcelain(): Promise<string[] | undefined> {
  return await parseStdoutByLine('git status --porcelain');
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
  return await parseStdoutByLine(`git rev-list ${reverse ? '--reverse' : ''} ${ref1}..${ref2}`);
}

export async function getBranchList(): Promise<string[]> {
  return await parseStdoutByLine("git for-each-ref --format='%(refname:short)' refs/heads");
}

type GitRemote = {
  name: string;
  url: string;
  type: 'fetch' | 'push';
};

export async function getRemoteList(): Promise<GitRemote[]> {
  const { stdout } = await execAsync('git remote -v');
  const remoteList = stdout.trim().split(/\r?\n/);
  return remoteList
    .map((line) => {
      const match = line.match(/^(\S+)\s+(\S+)\s+\((fetch|push)\)$/);
      if (!match) return null;

      const [, name, url, type] = match;
      return { name, url, type };
    })
    .filter((r): r is GitRemote => r !== null);
}

type BlameLine = {
  commit: string;
  author: string;
  authorTime: string; // ISO string
  authorTz: string;
  lineNumber: number;
};

// eslint-disable-next-line no-unused-vars
async function getBlame(file: string): Promise<BlameLine[]> {
  const lines = await parseStdoutByLine(`git blame --line-porcelain --abbrev=8 --follow "${file}"`);
  const result: BlameLine[] = [];
  let current: Partial<BlameLine> = {};

  for (const line of lines) {
    // Match the commit line (first line of each block)
    const commitMatch = line.match(/^([0-9a-f]{8,40}) (\d+) (\d+) (\d+)$/);
    if (commitMatch) {
      current.commit = commitMatch[1];
      current.lineNumber = parseInt(commitMatch[2], 10); // line number in file
      continue;
    }

    // Match author
    const authorMatch = line.match(/^author (.+)$/);
    if (authorMatch) {
      current.author = authorMatch[1];
      continue;
    }

    // Match author-time
    const timeMatch = line.match(/^author-time (\d+)$/);
    if (timeMatch) {
      const unixTs = parseInt(timeMatch[1], 10);
      current.authorTime = new Date(unixTs * 1000).toISOString();
      continue;
    }

    // Match author timezone
    const tzMatch = line.match(/^author-tz (.+)$/);
    if (tzMatch) {
      current.authorTz = tzMatch[1];
      continue;
    }

    // Blank line indicates end of current block
    if (line === '' && current.commit) {
      result.push(current as BlameLine);
      current = {};
    }
  }

  return result;
}
