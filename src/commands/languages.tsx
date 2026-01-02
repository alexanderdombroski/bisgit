import { execAsync } from '../utils/commands';
import { render } from 'ink';
import { WithProgress } from '../components/withProgress';

export async function languages() {
	const promise = (async () => {
		const repoName = await getGithubRepoName();
		return await getRepoLanguages(repoName);
	})();

	render(<WithProgress msg="Fetching repo languages" promise={promise} />);
	const data = await promise;

	const total = Object.values(data).reduce((sum, val) => sum + val, 0);
	const langDetails = Object.entries(data).map(
		([lang, bytes]) => `${lang}: ${Math.round((bytes / total) * 100)}% - ${formatBytes(bytes)}`
	);

	console.log(langDetails.join('\n'));
}

/** returns `<owner>/<repo>` */
async function getGithubRepoName() {
	const { stdout } = await execAsync('gh repo view --json nameWithOwner -q .nameWithOwner');
	return stdout.trim();
}

/** Bytes per language */
type LangData = {
	[language: string]: number;
};

async function getRepoLanguages(repo: string): Promise<LangData> {
	const { stdout } = await execAsync(`gh api repos/${repo}/languages`);
	return JSON.parse(stdout.trim());
}

function formatBytes(bytes: number, decimals = 2) {
	if (bytes === 0) return '0 B';
	const k = 1024; // or 1000 for decimal
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
