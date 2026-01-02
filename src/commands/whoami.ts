import { execAsync } from '../utils/commands';

export async function whoami() {
  const [name, login] = await Promise.allSettled([
    await getGitConfig('user.name'),
    await getGithubLogin(),
  ]);

  name.status === 'fulfilled' && console.info(`Git: ${name.value}`);
  login.status === 'fulfilled' && console.info(`Github: ${login.value}`);
}

async function getGithubLogin(): Promise<string> {
  const { stdout } = await execAsync('gh api user --jq .login');
  return stdout.trim();
}

async function getGitConfig(key: string) {
  const { stdout } = await execAsync(`git config ${key}`);
  return stdout.trim();
}
