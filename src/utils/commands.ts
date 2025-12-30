import { spawn, SpawnOptions } from 'node:child_process';

type Options = SpawnOptions & {
	silent?: boolean;
};

export function spawnCommand(cmd: string, args: string[], options?: Options) {
	const childProcess = spawn(cmd, args, options ?? {});

	if (!options?.silent) {
		childProcess.stdout?.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});
		childProcess.stderr?.on('data', (data) => {
			console.error(`stderr: ${data}`);
		});
		childProcess.on('close', (code) => {
			console.log(`Git process exited with code ${code}`);
		});
	}
}
