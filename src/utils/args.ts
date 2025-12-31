/** Return an argument from the CLI, supporting both `--arg=value` and `--arg value` */
export function getArg(argName: string): string | undefined {
	const argv = process.argv;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		// Case 1: --arg=value
		if (arg.startsWith(`${argName}=`)) {
			return arg.split('=')[1];
		}

		// Case 2: --arg value
		if (arg === argName && i + 1 < argv.length) {
			return argv[i + 1];
		}
	}

	return undefined;
}

/**
 * process.argv[0] → /usr/local/bin/node
 * process.argv[1] → ~/.nvm/versions/node/v24.11.0/bin/bisgit/dist/main.js
 * process.argv[2] → "rev-parse"
 * process.argv[3] → "HEAD"
 */

export function getCommand(): string | undefined {
	return process.argv[2];
}

export function getArgList(): string[] {
	return process.argv.slice(3);
}

/** Gets args \<remote> \<branch> or `origin` \<branch> if only one arg passed in */
export async function getRemoteBranchArgs(): Promise<{ remote: string; branch: string }> {
	const [arg1, arg2] = getArgList();

	if (!arg1) {
		console.error('Requires <branch> or <remote> <branch>');
		process.exit(1);
	}

	if (arg2) return { remote: arg1, branch: arg2 };

	return { remote: 'origin', branch: arg1 };
}
