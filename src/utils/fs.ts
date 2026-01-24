import fs from 'fs/promises';
import { parseStdoutByLine } from './commands';

export async function exists(fp: string): Promise<boolean> {
  try {
    await fs.access(fp);
    return true;
  } catch {
    return false;
  }
}

async function trackedFileList() {
  return await parseStdoutByLine('git ls-files');
}

async function untrackedFileList() {
  return await parseStdoutByLine('git ls-files --others --exclude-standard');
}

export type Tree = Record<string, any>;

export async function getFileTree(): Promise<Tree> {
  const [tracked, untracked] = await Promise.all([trackedFileList(), untrackedFileList()]);
  const files = [...tracked, ...untracked].sort(([a], [b]) => a.localeCompare(b));
  const tree: Tree = {};

  for (const file of files) {
    const parts = file.split('/');
    let current = tree;

    for (const part of parts) {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
  }

  return tree;
}

export function flattenTree(tree: Record<string, any>, basePath = ''): string[] {
  const result: string[] = [];

  for (const [name, child] of Object.entries(tree)) {
    const fullPath = basePath ? `${basePath}/${name}` : name;

    result.push(fullPath);

    if (Object.keys(child).length > 0) {
      result.push(...flattenTree(child, fullPath));
    }
  }

  return result;
}
