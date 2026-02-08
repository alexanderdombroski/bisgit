import { Box, measureElement, Text } from 'ink';
import { Section } from '../../components/section';
import { useStatus } from '../../components/hooks/useStatus';
import { useNav, type Section as SectionTitle } from '../../components/navigation';
import { useVariableSectionHeights } from '../../components/hooks/useVariableSectionHeights';
import { type PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { useDimensions } from '../../components/hooks/useDimensions';

export function FileList() {
  const { status } = useStatus();
  const { sectionHeight } = useDimensions();

  const { sections, showMerged } = useMemo(() => {
    const showMerged = status.some(({ changeType }) => changeType === 'U');
    const sections: SectionTitle[] = ['Staged', 'Changes'];
    if (showMerged) {
      sections.push('Unmerged');
    }
    return {
      sections,
      showMerged,
    };
  }, [status]);

  return (
    <Box width="50%" height={sectionHeight} flexDirection="column">
      <DynamicSection title="Staged" sections={sections}>
        {status?.map(({ name }) => (
          <Text key={name} wrap="truncate-end">
            {name}
          </Text>
        ))}
      </DynamicSection>
      <DynamicSection title="Changes" sections={sections}>
        {status?.map(({ name }) => (
          <Text key={name} wrap="truncate-end">
            {name}
          </Text>
        ))}
      </DynamicSection>
      {showMerged && (
        <DynamicSection title="Unmerged" sections={sections}>
          {status?.map(({ name }) => (
            <Text key={name} wrap="truncate-end">
              {name}
            </Text>
          ))}
        </DynamicSection>
      )}
    </Box>
  );
}

type DynamicSectionProps = PropsWithChildren<{
  title: SectionTitle;
  sections: SectionTitle[];
}>;

function DynamicSection({ title, sections, children }: DynamicSectionProps) {
  const ref = useRef(null);
  const { activeSection } = useNav();
  const [sectionHeight, setSectionHeight] = useState(0);
  useEffect(() => {
    if (ref.current) {
      const { height } = measureElement(ref.current);
      setSectionHeight(height - 1);
    }
  }, [ref.current, activeSection]);

  const { calcSectionHeight } = useVariableSectionHeights(sections);

  return (
    <Box ref={ref} height={calcSectionHeight(title)}>
      <Section title={title} innerHeight={sectionHeight}>
        {children}
      </Section>
    </Box>
  );
}
