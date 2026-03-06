import { useDimensions } from '../../components/hooks/useDimensions';
import { useResolved } from '../../components/hooks/useResolved';
import { Section } from '../../components/section';
import { commitsAhead, commitsBehind, getCurrentBranch } from '../../utils/git';
import { getRemoteDefault } from '../../commands/remoteDefault';

async function getAheadAndBehind() {
  const [branch, { remote }] = await Promise.all([getCurrentBranch(), getRemoteDefault()]);
  const [ahead, behind] = await Promise.all([
    commitsAhead(remote, branch),
    commitsBehind(remote, branch),
  ]);

  return [ahead, behind];
}

const UP_ARROW = '\u{2191}';
const DOWN_ARROW = '\u{2193}';

export function StatusDetails() {
  const { sectionHeight } = useDimensions();
  const { value: [ahead, behind] = [] } = useResolved(getAheadAndBehind);

  return (
    <Section
      title="Status"
      width="50%"
      innerHeight={sectionHeight - 2}
      footer={`${behind ?? 0}${DOWN_ARROW} ${ahead ?? 0}${UP_ARROW}`}
    >
      {null}
    </Section>
  );
}
