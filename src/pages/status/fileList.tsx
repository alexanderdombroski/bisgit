import { Box, Text, useInput } from 'ink';
import { useStatus } from '../../components/hooks/useStatus';
import { useNav, type Section as SectionTitle } from '../../components/navigation';
import { useEffect, useMemo } from 'react';
import { useDimensions } from '../../components/hooks/useDimensions';
import { DynamicSection } from '../../components/dynamicSection';
import { useScrollable } from '../../components/hooks/useScrollable';
import { type FileStatus } from '../../utils/git';
import { useTruncationMode } from '../../components/hooks/useTruncationMode';
import { useKeybindings } from '../../components/hooks/useKeybindings';
import { useErrorCatcher } from '../../components/hooks/useErrorCatcher';
import { execAsync } from '../../utils/commands';

type StatusFilter = (status: FileStatus) => boolean;

const isStaged: StatusFilter = (status) => status.staged;
const isUnmerged: StatusFilter = (status) => status.changeType.includes('U');
const isUnstaged: StatusFilter = (status) => !isStaged(status) && !isUnmerged(status);

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
        {(height) => (
          <StatusList sectionHeight={height} title="Staged" filterCondition={isStaged} />
        )}
      </DynamicSection>
      <DynamicSection title="Changes" sections={sections}>
        {(height) => (
          <StatusList sectionHeight={height} title="Changes" filterCondition={isUnstaged} />
        )}
      </DynamicSection>
      {showMerged && (
        <DynamicSection title="Unmerged" sections={sections}>
          {(height) => (
            <StatusList sectionHeight={height} title="Unmerged" filterCondition={isUnmerged} />
          )}
        </DynamicSection>
      )}
    </Box>
  );
}

type ListProps = {
  sectionHeight: number;
  filterCondition: StatusFilter;
  title: SectionTitle;
};

function StatusList({ sectionHeight, filterCondition, title }: ListProps) {
  const { isLocked, activeSection } = useNav();
  const { mode } = useTruncationMode();
  const { status, refresh } = useStatus();
  const filtered = useMemo(() => status.filter(filterCondition), [status]);
  const { selectedValue, outList, scrollDown, scrollUp } = useScrollable(filtered, sectionHeight);
  const { attempt } = useErrorCatcher();

  const inStagingArea = activeSection === 'Staged';
  const inOtherFileList = activeSection === 'Changes' || activeSection === 'Unmerged';

  const { setKeybinding, removeKeybinding } = useKeybindings();

  useEffect(() => {
    if (inStagingArea) {
      setKeybinding('a', 'unstage');
    } else if (inOtherFileList) {
      setKeybinding('a', 'stage');
    }
    return () => removeKeybinding('a');
  }, [activeSection]);

  useInput((input, key) => {
    if (activeSection !== title || isLocked) return;

    if (key.upArrow) {
      scrollUp();
    } else if (key.downArrow) {
      scrollDown();
    }

    if (!selectedValue) return;
    if (input === 'a') {
      if (inStagingArea) {
        attempt(() => unstage(selectedValue.name));
      } else if (inOtherFileList) {
        attempt(() => stage(selectedValue.name));
      }
      refresh();
    }
  });

  return (
    <>
      {outList.map(({ name }) => (
        <Box key={name} flexDirection="row" flexWrap="nowrap">
          <Box minWidth={2}>{name === selectedValue?.name ? <Text>{'> '}</Text> : null}</Box>
          <Box minWidth={8}>
            <Text wrap={mode}>{name}</Text>
          </Box>
        </Box>
      ))}
    </>
  );
}

async function stage(file: string) {
  await execAsync(`git add "${file}"`);
}

async function unstage(file: string) {
  await execAsync(`git restore --staged "${file}"`);
}
