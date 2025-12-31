import { appendFileSync } from 'node:fs';
import { getArgList } from '../utils/cli';
import { getGitConfigPath } from '../utils/git';
import { requireFileExists } from '../utils/guards';
import { parseIgnoreFile } from '../utils/ignore';

export async function exclude() {
	const fp = await getGitConfigPath('info/exclude');
	await requireFileExists(fp);
	const entries = await parseIgnoreFile(fp);
	getArgList().forEach((entry) => {
		if (entries.includes(entry)) {
			console.info(`Already Exists: '${entry}'`);
		} else {
			appendFileSync(fp, `${entry}\n`);
			console.info(`Added '${entry}'`);
		}
	});

	console.info(`\nSee file at ${fp}`);
}
