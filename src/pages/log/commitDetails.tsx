import { Text } from 'ink';
import { useResolved } from '../../components/hooks/useResolved';
import { Section } from '../../components/section';
import { execAsync } from '../../utils/commands';

export function CommitDetails({ sha }: { sha?: string }) {
  const { resolved, value } = useResolved(() => getCommitDetails(sha), [sha]);
  return (
    <Section title="Commit Details" width="50%" height="100%">
      {sha && resolved && <Text>{value}</Text>}
    </Section>
  );
}

async function getCommitDetails(ref?: string) {
  if (!ref) return;
  const { stdout } = await execAsync(`git show ${ref} --name-only`);
  return stdout.trim();
}
