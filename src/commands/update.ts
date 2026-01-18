import { spawnAsync, spawnCommand } from '../utils/commands';

async function isUpdated(): Promise<boolean> {
  const { code } = await spawnAsync('npm', ['outdated', '-g', 'bisgit']);
  return code === 0;
}

export async function update() {
  if (await isUpdated()) {
    return console.info('Already up to date');
  }

  spawnCommand('npm', ['i', '-g', 'bisgit@latest']);
}
