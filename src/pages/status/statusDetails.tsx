import { useDimensions } from '../../components/hooks/useDimensions';
import { Section } from '../../components/section';

export function StatusDetails() {
  const { sectionHeight } = useDimensions();

  return (
    <Section title="Status" width="50%" innerHeight={sectionHeight - 1}>
      {null}
    </Section>
  );
}
