import { execAsync } from '../commands';

type RepoName = {
  owner?: string;
  repo?: string;
};

export async function getRepoName(): Promise<RepoName> {
  const { stdout } = await execAsync('gh repo view --json nameWithOwner --jq .nameWithOwner');
  const combined = stdout.trim();
  const [owner, repo] = combined.split('/');
  return { owner, repo };
}

export async function getForkName(): Promise<RepoName> {
  const { stdout } = await execAsync('gh repo view --json parent');
  const data = JSON.parse(stdout);
  return { repo: data.parent?.name, owner: data.parent?.owner?.login };
}
