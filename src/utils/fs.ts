import fs from 'fs/promises';

export async function exists(fp: string): Promise<boolean> {
	try {
		await fs.access(fp);
		return true;
	} catch {
		return false;
	}
}
