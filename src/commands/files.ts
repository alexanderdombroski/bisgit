import { getArgList } from '../utils/args';
import { spawnGitWithColor, parseStdoutByLine } from '../utils/commands';

export async function files() {
  const args = getArgList();
  if (args[0]) {
    const files = await getFiles(args[0]);
    console.info(files.join('\n'));
  } else {
    spawnGitWithColor(['status', '--short']);
  }
}

export async function getFiles(ref: string): Promise<string[]> {
  if (/^stash@\{\d+\}$/.test(ref)) {
    return await parseStdoutByLine(`git stash show -p --include-untracked --name-only ${ref}`);
  } else {
    return await parseStdoutByLine(`git show --name-only --pretty=format:"" ${ref}`);
  }
}
