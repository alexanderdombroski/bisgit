import { execAsync } from '../../utils/commands';

export const modes = [
  { value: () => parseLog('git log --oneline -n 400'), label: 'log' },
  { value: () => parseLog('git log --oneline --tags --no-walk --decorate'), label: 'tags' },
  { value: () => parseLog('git reflog'), label: 'reflog' },
] as const;

export type Mode = (typeof modes)[number];

type LogEntry = {
  sha: string;
  message: string;
};

async function parseLog(command: string): Promise<LogEntry[]> {
  const { stdout } = await execAsync(command);
  const lines = stdout.trim().split(/\r?\n/);
  return lines.map(splitLogEntry);
}

function splitLogEntry(line: string): LogEntry {
  const firstSpace = line.indexOf(' ');
  return {
    sha: line.slice(0, firstSpace),
    message: line.slice(firstSpace + 1),
  };
}
