import { getConfig } from '../utils/git/config';
import chalk from 'chalk';

export async function config() {
  const config = await getConfig();
  for (const [k, v] of config) {
    console.info(`${chalk.yellow(k)} = ${v}`);
  }
}
