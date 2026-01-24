import { Box } from 'ink';
import { useDimensions } from '../../components/hooks/useDimensions';
import { Tree } from './tree';
import { TreeNavigationProvder } from './useTreeNavigation';
import { FileMeta } from './filemeta';

function AllSections() {
  const { width, sectionHeight } = useDimensions();

  return (
    <Box width={width} height={sectionHeight}>
      <TreeNavigationProvder>
        <Tree />
        <FileMeta />
      </TreeNavigationProvder>
    </Box>
  );
}

export { AllSections as Files };
