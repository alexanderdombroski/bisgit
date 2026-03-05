import { Box, Text } from 'ink';
import { useStatus } from '../../components/hooks/useStatus';
import { type Section as SectionTitle } from '../../components/navigation';
import { useMemo } from 'react';
import { useDimensions } from '../../components/hooks/useDimensions';
import { DynamicSection } from '../../components/dynamicSection';

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
