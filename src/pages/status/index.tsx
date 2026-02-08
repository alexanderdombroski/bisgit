import { Box } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { FileList } from './fileList';
import { StatusDetails } from './statusDetails';

function AllSections() {
  const { width, sectionHeight } = useDimensions();

  return (
    <Box width={width} height={sectionHeight} flexDirection="row">
      <FileList />
      <StatusDetails />
    </Box>
  );
}

export { AllSections as Status };
