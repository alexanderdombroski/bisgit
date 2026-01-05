import { getCommand } from './utils/args';

async function main() {
  const cmd = getCommand();
  if (!cmd) {
    const { renderApp } = await import('./components/index.jsx');
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
  console.error(`An error occurred: ${error.stderr ?? error.message}`);
  process.exit(1);
});
