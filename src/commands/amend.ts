import { getArgList } from '../utils/args';
import { spawnCommand } from '../utils/commands';
import { requireNotDetached, requireStaged } from '../utils/guards';

export async function amend() {
  await requireNotDetached();
  await requireStaged();
  spawnCommand('git', ['commit', '--amend', '--no-edit', ...getArgList()], {
    stdio: 'inherit',
    silent: true,
    triggerExit: true,
  });
}
