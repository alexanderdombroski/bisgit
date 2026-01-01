import { execSync } from 'node:child_process';
import { requireRootCommit } from '../utils/guards';

/** handler for sha command */
export async function sha() {
	requireRootCommit();

	const sha = getShortSha(process.argv[3]);
	const { default: clipboard } = await import('clipboardy');
	await clipboard.write(sha);
	console.log(`'${sha}' copied to clipboard`);
}

/** runs rev-parse to get the short sha id of a ref */
export function getShortSha(ref = 'HEAD') {
	return execSync(`git rev-parse --short ${ref}`, { encoding: 'utf-8' }).trim();
}
