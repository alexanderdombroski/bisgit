import { readFile } from 'node:fs/promises';

export async function parseIgnoreFile(fp: string): Promise<string[]> {
	const content = await readFile(fp, 'utf-8');
	return content
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'));
}
