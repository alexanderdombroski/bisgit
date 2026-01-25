import { render } from 'ink';
import { Confirmation } from '../components/confirmation';
import { getStatusPorcelain, isDiffClean } from '../utils/git';
import { requireGitRepo } from '../utils/guards';
import { execAsync } from '../utils/commands';

export async function wipe() {
  requireGitRepo();

  if (await isDiffClean()) {
    return console.log('Already a clean working tree');
  }

  const status = await getStatusPorcelain();
  if (!status) {
    throw new Error('git status cmd failed');
  }

  const report = new Report(status);
  report.displayReport();

  const reset = async () => {
    await execAsync('git reset --hard');
    await execAsync('git clean -f');
    return `Altered ${report.willDelete.length + report.willRecreate.length + report.willRevert.length} files.`;
  };

  render(
    <Confirmation
      prompt="Approve these changes?"
      msg="Running git reset && git clean"
      onConfirm={reset}
    />
  );
}

class Report {
  willDelete: string[] = []; // ? A
  willRecreate: string[] = []; // D DU
  willRevert: string[] = []; // T R C M U UD

  constructor(status: string[]) {
    status.forEach((entry) => {
      if (entry) {
        const code = entry.slice(0, 2).trim();
        const file = entry.slice(3);
        if (code.includes('?') || code.includes('A')) {
          this.willDelete.push(file);
        } else if (code === 'DU' || code === 'D') {
          this.willRecreate.push(file);
        } else {
          this.willRevert.push(file);
        }
      }
    });

    this.willDelete.sort();
    this.willRecreate.sort();
    this.willRevert.sort();
  }

  displayReport() {
    this.displaySection('Will Recreate:', this.willRecreate);
    this.displaySection('Will Revert:', this.willRevert);
    this.displaySection('Will Delete:', this.willDelete);
  }

  private displaySection(title: string, entries: string[]) {
    if (entries.length) {
      console.log(`${title}\n${entries.map((file) => `- ${file}`).join('\n')}`);
    }
  }
}
