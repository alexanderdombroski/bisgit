import { render } from 'ink';
import { execAsync, parseStdoutByLine, spawnGitWithColor } from '../utils/commands';
import { requireStaged } from '../utils/guards';
import { WithProgress } from '../components/withProgress';
import { getArgList } from '../utils/args';
import { type Item, Picker } from '../components/picker';

export async function coauthor() {
  await requireStaged();
  const username = getArgList()[0];

  // Flow without preselected user
  if (!username) {
    const committers = await getCommiters();
    const choices: Item<Committer>[] = committers.map(
      (comitter): Item<Committer> => ({
        value: comitter,
        label: `${comitter.name} ${comitter.email} (${comitter.commits})`,
      })
    );

    const onSelect = async ({ value: { name, email } }: Item<Committer>) => {
      await createCoauthorCommit(name, email.slice(1, -1));
    };

    render(<Picker items={choices} prompt="Who assisted in this commit?" onSelect={onSelect} />);
    return;
  }

  // Flow with preselected user
  const promise = (async () => {
    const data = await getUserData(username);
    if (!data.email) {
      console.error(`Couldn't find an email for ${username}`);
      process.exit(1);
    }
    return data;
  })();

  render(<WithProgress msg="Fetching name and email" promise={promise} />);
  const { name, email } = await promise;
  createCoauthorCommit(name, email as string);
}

type UserData = {
  login: string;
  name: string;
  email?: string;
};

async function getUserData(username: string): Promise<UserData> {
  const { stdout } = await execAsync(`gh api users/${username}`);
  return JSON.parse(stdout.trim());
}

type Committer = {
  name: string;
  email: string;
  commits: number;
};

async function getCommiters(): Promise<Committer[]> {
  const commiters = await parseStdoutByLine('git log --format="%an|<%ae>"');
  const map = new Map<string, Committer>();
  for (let line of commiters) {
    const [name, email] = line.split('|');
    const key = `${name}|${email}`;
    if (!map.has(key)) {
      map.set(key, { name, email, commits: 0 });
    }

    map.get(key)!.commits += 1;
  }
  return [...map.values()].toSorted((a, b) => b.commits - a.commits);
}

async function createCoauthorCommit(name: string, email: string) {
  spawnGitWithColor([
    'commit',
    '--edit',
    '-m',
    '<insert summary>',
    '-m',
    `Co-authored-by: ${name} <${email}>`,
  ]);
}
