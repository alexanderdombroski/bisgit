import { parseStdoutByLine } from '../commands';

export async function getConfig(): Promise<[string, string][]> {
  const [global, local] = await Promise.all([
    await parseStdoutByLine('git config --list --global'),
    await parseStdoutByLine('git config --list --local'),
  ]);

  return [...global, ...local]
    .filter(Boolean)
    .map((line) => line.trim())
    .filter((line) => !line.startsWith('alias'))
    .map((line) => {
      const index = line.indexOf('=');
      if (index === -1) return [line, ''];
      const key = line.slice(0, index);
      const value = line.slice(index + 1);
      return [key, value];
    });
}
