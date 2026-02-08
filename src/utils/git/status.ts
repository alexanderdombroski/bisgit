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

  const status = statusLines.map(
    (line): FileStatus => ({
      staged: line[1] === ' ',
      changeType: (line[0] || line[1]) as ChangeType,
      name: line.slice(3),
    })
  );
  return status;
}
