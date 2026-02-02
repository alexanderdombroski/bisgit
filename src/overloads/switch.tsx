import { render } from 'ink';
import { getBranchList } from '../utils/git';
import { type Item, Picker } from '../components/picker';
import { execAsync } from '../utils/commands';
import { requireCleanStatus } from '../utils/guards';

export async function switchCmd() {
  await requireCleanStatus();

  const branches = await getBranchList();
  const items = branches.map((branch) => ({ value: branch, label: branch }));

  const onSelect = async ({ value }: Item<string>) => {
    await execAsync(`git switch ${value}`);
  };

  render(
    <Picker prompt="Which branch would you like to switch to?" items={items} onSelect={onSelect} />
  );
}
