import { execAsync, spawnAsync, spawnCommand } from '../utils/commands';
import { getCurrentVersion } from './version';

async function isUpdated(): Promise<boolean> {
  const { code } = await spawnAsync('npm', ['outdated', '-g', 'bisgit']);
  return code === 0;
}

async function getLatestVersion() {
  const { stdout } = await execAsync('npm view bisgit version', { encoding: 'utf8' });
  return stdout.trim();
}

export async function update() {
  if (await isUpdated()) {
    return console.info('Already up to date');
  }

  console.info(`Updating: ${await getCurrentVersion()} -> ${await getLatestVersion()}`);
  spawnCommand('npm', ['i', '-g', 'bisgit@latest']);
}
