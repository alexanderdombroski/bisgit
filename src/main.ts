import { renderApp } from './demo';

async function main() {
	renderApp();
}

main().catch((error) => {
	console.error(`An error occurred: ${error}`);
});
