import { render } from 'ink';
import { execAsync } from '../utils/commands';
import { requireArg, requireCleanStatus } from '../utils/guards';
import { WithProgress } from '../components/withProgress';
import { isDeepStrictEqual } from 'node:util';
import { getMergeBase } from '../utils/git';

export async function codeReview() {
  const pr = requireArg('Error: missing id of PR to checkout');
  await requireCleanStatus();

  const co = (async () => {
    return Promise.all([
      execAsync(`gh co ${pr}`),
      execAsync(`gh pr view ${pr} --json baseRefName -q .baseRefName`),
    ]);
  })();
  render(<WithProgress msg={`Checking out pr #${pr}`} promise={co} />);
  const [, { stdout }] = await co;
  const destination = stdout.trim();

  const pull = (async () => {
    await execAsync(`git switch ${destination}`);
    await execAsync('git pull');
    await execAsync('git switch -');
  })();
  render(<WithProgress msg={`Updating ${destination} branch merge destination`} promise={pull} />);
  await pull;

  const reset = (async () => {
    const base = await getMergeBase(destination, 'HEAD');
    await execAsync(`git reset ${base} --soft`);
    return await getShortStat('HEAD');
  })();
  render(
    <WithProgress msg={'Creating an editable, explorable, local PR experience'} promise={reset} />
  );

  const [localShortStat, githubShortStat] = await Promise.all([reset, getPrShortStat(pr)]);
  const { files, additions, deletions } = githubShortStat;

  if (isDeepStrictEqual(localShortStat, githubShortStat)) {
    return console.info(`Files: ${files}, +${additions} -${deletions}`);
  }

  console.info("The PR stat doesn't match the local stat.");
  console.info('LOCAL');
  console.table(localShortStat);
  console.info('GITHUB');
  console.table(githubShortStat);
  console.info("One option to fix (there'll likely be conflicts):");
  console.info('1. git stash -u');
  console.info(`2. git merge ${destination}`);
  console.info('3. git stash pop');
}

type ShortStat = {
  files: number;
  additions: number;
  deletions: number;
};

async function getShortStat(ref: string): Promise<ShortStat> {
  const { stdout } = await execAsync(`git diff --shortstat ${ref}`);
  const regex = /(\d+)\s+files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/;
  const match = stdout.trim().match(regex);

  if (!match) {
    throw new Error(`Couldn\'t generate short stat for ref(s): ${ref}`);
  }

  const [, files, insertions, deletions] = match;
  return {
    files: parseInt(files, 10),
    additions: insertions ? parseInt(insertions, 10) : 0,
    deletions: deletions ? parseInt(deletions, 10) : 0,
  };
}

async function getPrShortStat(id: number | string): Promise<ShortStat> {
  const { stdout } = await execAsync(`gh pr view ${id} --json deletions,files,additions`);
  const data = JSON.parse(stdout.trim());
  data.files = data.files.length;
  return data as ShortStat;
}
