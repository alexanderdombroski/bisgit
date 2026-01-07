import { use } from 'react';
import { Section } from '../components/section';
import { Text } from 'ink';
import { getStatusPorcelain } from '../utils/git';

const promise = getStatusPorcelain();

export default function Status() {
  const status = use(promise);

  return (
    <Section flexDirection="column" title="Bisgit">
      {status?.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Section>
  );
}
