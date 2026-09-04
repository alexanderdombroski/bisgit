import { getArgList } from '../../utils/args';
import { add } from './add';
import { ls } from './ls';
import { rm } from './rm';

const subcommands: Record<string, () => void | Promise<void>> = {
  add,
  ls,
  rm,
};

export async function wt() {
  const [subcommand] = getArgList();

  if (Object.hasOwn(subcommands, subcommand)) {
    await subcommands[subcommand]?.();
    return;
  }

  // If argument is not a subcommand (e.g. `gi wt <branch>`), treat as branch name for add
  console.warn('Usage: gi wt <cmd>');
  return;
}
