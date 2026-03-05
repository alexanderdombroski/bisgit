import { parseStdoutByLine } from '../commands';

export async function getStatusPorcelain(): Promise<string[]> {
  return await parseStdoutByLine('git status --porcelain');
}

/** https://git-scm.com/docs/git-status#_short_format */
type ChangeType = 'M' | 'T' | 'A' | 'D' | 'R' | 'C' | 'U' | '?';
export type FileStatus = {
  staged: boolean;
  changeType: ChangeType;
  name: string;
};

export async function getStatus(): Promise<FileStatus[]> {
  const statusLines = await getStatusPorcelain();

  const status: FileStatus[] = [];

  for (const line of statusLines) {
    const stagedStatus = line[0];
    const worktreeStatus = line[1];
    const name = line.slice(3);

    if (stagedStatus !== ' ') {
      status.push({
        staged: true,
        changeType: stagedStatus as ChangeType,
        name,
      });
    }

    if (worktreeStatus !== ' ') {
      status.push({
        staged: false,
        changeType: worktreeStatus as ChangeType,
        name,
      });
    }
  }

  return status;
}
