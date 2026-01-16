import { Section } from '../components/section';
import { Text } from 'ink';
import { getStatusPorcelain } from '../utils/git';
import { useResolved } from '../components/hooks/useResolved';

export default function Status() {
  const { value: status, resolved } = useResolved(getStatusPorcelain);

  return (
    <Section flexDirection="column" title="Bisgit" width="100%">
      {resolved && status?.map((line, i) => <Text key={i}>{line}</Text>)}
    </Section>
  );
}
