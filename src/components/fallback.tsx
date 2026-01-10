import { Text } from 'ink';
import Spinner from 'ink-spinner';
import { Section, type SectionProps } from './section';

export function Fallback(props: Omit<SectionProps, 'children'> = {}) {
  return (
    <Section {...props}>
      <Text>
        <Spinner />
        &nbsp;Loading
      </Text>
    </Section>
  );
}
