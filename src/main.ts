import { getCommand } from './utils/args';

async function main() {
	const cmd = getCommand();
	if (!cmd) {
		const { renderApp } = await import('./components/demo.jsx');
		return renderApp();
	}

	const { runCommand } = await import('./commands/index.js');
	if (await runCommand(cmd)) return;

	const { runWrapper } = await import('./wrapper/index.js');
	if (await runWrapper(cmd)) return;

	console.error('unknown command');
	process.exit(1);
}

main().catch((error) => {
	if (typeof error === 'object') {
		// TODO - only log generic json errors if loglevel is debug
		error = JSON.stringify(error, undefined, 2);
	}
	console.error(`An error occurred: ${error}`);
	process.exit(1);
});
