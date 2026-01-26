import { getArgList } from '../utils/args';
import { type ChangeType, getLinesChanged, isStashRef } from '../utils/git';
import { requireArg } from '../utils/guards';
import chalk from 'chalk';

// TODO - Add an option to exclude files from the diff?

export async function lines() {
  requireArg();
  const args = getArgList();
  const [ref1, ref2] = args.filter((arg) => arg !== '-v');

  let details = [];
  if (isStashRef(ref1)) {
    details.push(...(await getLinesChanged(`${ref1}^3`)));
    details.push(...(await getLinesChanged(`${ref1}^2`)));
  } else {
    details.push(...(await getLinesChanged(ref1, ref2)));
  }

  if (args.includes('-v')) {
    const changeTypeShort: Record<ChangeType, string> = {
      added: 'A',
      modified: 'M',
      deleted: 'D',
      binary: 'B',
    };

    details.forEach((entry) => {
      const changeType = getColorType(entry.changeType)(changeTypeShort[entry.changeType]);
      let fileSummary = `${changeType} ${entry.file} |`;
      if (entry.added) {
        fileSummary += chalk.green(` +${entry.added}`);
      }
      if (entry.deleted) {
        fileSummary += chalk.red(` -${entry.deleted}`);
      }

      console.info(fileSummary);
    });
  } else {
    const files = new Set(details.map(({ file }) => file)).size;
    const [additions, deletions] = details.reduce(
      (acc, { added, deleted }) => {
        return [acc[0] + (added ?? 0), acc[1] + (deleted ?? 0)];
      },
      [0, 0]
    );
    const added = chalk.green(`+${additions}`);
    const deleted = chalk.red(`-${deletions}`);
    console.info(`${files} files: ${added} ${deleted}`);
  }
}

const getColorType = (changeType: ChangeType) => {
  switch (changeType) {
    case 'modified':
      return chalk.yellow;
    case 'added':
      return chalk.green;
    case 'deleted':
      return chalk.red;
    case 'binary':
    default:
      return (val: string) => val;
  }
};
