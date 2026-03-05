import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useNav, type Section as SectionTitle } from './navigation';
import { Box, measureElement } from 'ink';
import { useVariableSectionHeights } from './hooks/useVariableSectionHeights';
import { Section } from './section';

type DynamicSectionProps = PropsWithChildren<{
  title: SectionTitle;
  sections: SectionTitle[];
}>;

export function DynamicSection({ title, sections, children }: DynamicSectionProps) {
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
