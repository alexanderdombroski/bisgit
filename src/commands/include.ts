import { readFile, writeFile } from 'node:fs/promises';
import { getArgList } from '../utils/args';
import { getGitConfigPath } from '../utils/git';
import { requireFileExists } from '../utils/guards';
import { parseIgnoreFile } from '../utils/ignore';

export async function include() {
	const fp = await getGitConfigPath('info/exclude');
	await requireFileExists(fp);
	const entries = await parseIgnoreFile(fp);
	const removals = getArgList();
	removals
		.filter((entry) => !entries.includes(entry))
		.forEach((entry) => console.info(`No match: '${entry}'`));

	const content = await readFile(fp, 'utf-8');
	const lines = content.split(/\r?\n/).map((line) => line.trim());
	const linesToKeep = lines.filter((line) => !removals.includes(line));
	await writeFile(fp, linesToKeep.join('\n'));

	console.info(`\nRemoved ${lines.length - linesToKeep.length} entries from ${fp}`);
}
