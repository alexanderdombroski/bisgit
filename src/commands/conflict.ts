import { spawn } from 'node:child_process';
import { getMergeBase } from '../utils/git';
import { createInterface } from 'node:readline/promises';
import { requireArg } from '../utils/guards';
import chalk from 'chalk';

export async function conflict() {
  const target = requireArg('Error: missing target branch argument');
  const base = await getMergeBase('HEAD', target);
  const { promise, resolve, reject } = Promise.withResolvers<number>();

  const merge = spawn('git', ['merge-tree', base, 'HEAD', target]);
  const rl = createInterface({ input: merge.stdout, crlfDelay: Infinity });

  let inConflictBlock = false;
  let conflicts = 0;

  rl.on('line', (line) => {
    line = line.trimEnd();
    if (line === '+<<<<<<< .our') {
      inConflictBlock = true;
      console.info(chalk.red(line));
      conflicts += 1;
    } else if (line === '+>>>>>>> .their') {
      inConflictBlock = false;
      console.info(chalk.green(line));
    } else if (line === '+=======') {
      console.info(chalk.yellow(line));
    } else if (inConflictBlock) {
      console.info(line);
    }
  });

  rl.on('close', () => resolve(conflicts));
  merge.on('error', reject);

  const conflictCount = await promise;
  const message = conflictCount
    ? `❌ ${conflictCount} conflicts would occur!`
    : '✅ No conflicts. Safe to merge.';
  console.info(message);
}
