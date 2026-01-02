import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { requireRootCommit } from '../utils/guards';

export async function churn() {
  requireRootCommit;

  const counts = await countLogFiles();
  const sorted = [...counts.entries()].sort(([, a], [, b]) => b - a).slice(0, 25);
  const padSize = sorted[0][1].toString().length;
  console.info(
    sorted.map(([file, count]) => `${String(count).padEnd(padSize)} ${file}:`).join('\n')
  );
}

async function countLogFiles() {
  const { promise, resolve, reject } = Promise.withResolvers<Map<string, number>>();

  const counts = new Map<string, number>();
  const res = spawn('git', ['log', '--all', '-M', '-C', '--name-only', '--format=format:']);

  const rl = createInterface({ input: res.stdout, crlfDelay: Infinity });
  rl.on('line', (line) => {
    const file = line.trim();
    if (file) {
      counts.set(file, (counts.get(file) ?? 0) + 1);
    }
  });

  rl.on('close', () => resolve(counts));
  res.on('error', reject);

  return promise;
}
