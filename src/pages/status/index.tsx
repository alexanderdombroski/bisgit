import { Box, Text } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';

function AllSections() {
  const { width, sectionHeight } = useDimensions();

  return (
    <Box width={width} height={sectionHeight}>
      <Text>TODO - Status Page</Text>
    </Box>
  );
}

export { AllSections as Status };
