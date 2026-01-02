import { render } from 'ink';
import { execAsync, spawnGitWithColor } from '../utils/commands';
import { requireArg, requireStaged } from '../utils/guards';
import { WithProgress } from '../components/withProgress';

export async function coauthor() {
	await requireStaged();
	const username = requireArg('Error: missing github username argument');

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
	spawnGitWithColor([
		'commit',
		'--edit',
		'-m',
		'<insert summary>',
		'-m',
		`Co-authored-by: ${name} <${email}>`,
	]);
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
