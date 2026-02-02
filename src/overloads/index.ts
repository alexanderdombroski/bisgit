import { switchCmd } from './switch';

const commands: Record<string, () => void | Promise<void>> = {
  switch: switchCmd,
};

/** Run an custom workflow for a git/gh command if no args are passed in */
export async function runOverload(cmd: string): Promise<boolean> {
  await commands[cmd]?.();
  return Object.hasOwn(commands, cmd);
}
