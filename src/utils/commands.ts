import { exec, spawn } from 'node:child_process';
import type { SpawnOptions, StdioOptions } from 'node:child_process';
import { promisify } from 'node:util';

type Options = SpawnOptions & {
  silent?: boolean;
  triggerExit?: boolean;
};

export function spawnCommand(cmd: string, args: string[], options?: Options) {
  const childProcess = spawn(cmd, args, options ?? {});

  if (!options?.silent) {
    childProcess.stdout?.on('data', (data) => {
      console.log(String(data));
    });
    childProcess.stderr?.on('data', (data) => {
      console.error(String(data));
    });
  }
  childProcess.on('close', (code) => {
    if (options?.triggerExit) {
      process.exit(code);
    }
  });
}

export const execAsync = promisify(exec);

export async function parseStdoutByLine(command: string): Promise<string[]> {
  const { stdout } = await execAsync(command);
  const output = stdout.trimEnd();
  return output ? output.split(/\r?\n/) : [];
}

export async function spawnAsync(cmd: string, args: string[], options: SpawnOptions = {}) {
  const { promise, resolve, reject } = Promise.withResolvers<{
    code: number | null;
    stdout?: string;
    stderr?: string;
  }>();

  const child = spawn(cmd, args, options);
  let stdout = '';
  let stderr = '';

  child.stdout?.on('data', (d) => (stdout += d));
  child.stderr?.on('data', (d) => (stderr += d));

  child.on('close', (code) => resolve({ code, stdout, stderr }));
  child.on('error', (err) => reject(err));

  return promise;
}

export async function spawnGitWithColor(args: string[], stdio: StdioOptions = 'inherit') {
  const { promise, resolve, reject } = Promise.withResolvers<{
    code: number | null;
  }>();

  const child = spawn('git', ['-c', 'color.ui=always', ...args], {
    stdio,
  });

  child.on('close', (code) => {
    if (code === 0) {
      resolve({ code });
    } else {
      reject({ code });
    }
  });
  child.on('error', reject);

  return promise;
}
