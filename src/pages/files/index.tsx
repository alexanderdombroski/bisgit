import { Box } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { Tree } from './tree';
import { FileMeta } from './filemeta';

function AllSections() {
  const { width, sectionHeight } = useDimensions();

  return (
    <Box width={width} height={sectionHeight}>
      <Tree />
      <FileMeta />
    </Box>
  );
}

export { AllSections as Files };
