import { spawn, type SpawnOptions, type StdioOptions } from 'node:child_process';

type Options = SpawnOptions & {
	silent?: boolean;
};

export function spawnCommand(cmd: string, args: string[], options?: Options) {
	const childProcess = spawn(cmd, args, options ?? {});

	if (!options?.silent) {
		childProcess.stdout?.on('data', (data) => {
			console.log(data);
		});
		childProcess.stderr?.on('data', (data) => {
			console.error(`stderr: ${data}`);
		});
		childProcess.on('close', (code) => {
			console.log(`Git process exited with code ${code}`);
		});
	}
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
