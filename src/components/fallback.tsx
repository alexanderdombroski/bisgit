import { Text } from 'ink';
import Spinner from 'ink-spinner';
import { Section } from './section';

export function Fallback() {
  return (
    <Section>
      <Text>
        <Spinner />
        &nbsp;Loading
      </Text>
    </Section>
  );
}
