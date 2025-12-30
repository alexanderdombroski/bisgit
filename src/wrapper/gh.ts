const GH_COMMANDS = [
	'auth',
	'browse',
	'codespace',
	'gist',
	'issue',
	'org',
	'pr',
	'project',
	'release',
	'repo',
	'cache',
	'run',
	'workflow',
	'agent-task',
	'alias',
	'api',
	'attestation',
	'completion',
	'config', // Defaults to git's config
	'extension',
	'gpg-key',
	'label',
	'preview',
	'ruleset',
	'search',
	'secret',
	'ssh-key',
	'status', // Defaults to git's status
	'variable',
];

export function isGh(cmd: string): boolean {
	return GH_COMMANDS.includes(cmd);
}
