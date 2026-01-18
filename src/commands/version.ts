import { execAsync } from '../utils/commands';

export async function getCurrentVersion(): Promise<string> {
  const { stdout } = await execAsync('npm list -g bisgit --depth=0 --json');
  const data = JSON.parse(stdout.trim());
  return data.dependencies.bisgit.version;
}

export async function showVersion() {
  console.info(await getCurrentVersion());
}
