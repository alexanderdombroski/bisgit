import { parseStdoutByLine } from '../commands';

export async function getStatusPorcelain(): Promise<string[]> {
  return await parseStdoutByLine('git status --porcelain');
}
