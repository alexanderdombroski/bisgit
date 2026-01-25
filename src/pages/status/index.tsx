import { Box, Text } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { Section } from '../../components/section';
import { useResolved } from '../../components/hooks/useResolved';
import { getStatusPorcelain } from '../../utils/git';

function AllSections() {
  const { width, sectionHeight } = useDimensions();

  const { value: status } = useResolved(getStatusPorcelain);

  return (
    <Box width={width} height={sectionHeight}>
      <Section title="Status" innerHeight={sectionHeight - 1}>
        {status?.map((file) => (
          <Text key={file}>{file}</Text>
        ))}
      </Section>
    </Box>
  );
}

export { AllSections as Status };
