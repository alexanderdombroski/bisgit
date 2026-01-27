import { Box, Text } from 'ink';
import { Section } from '../../components/section';
import { useResolved } from '../../components/hooks/useResolved';
import { getLinesChanged } from '../../utils/git';
import { Title } from '../../components/title';

type StashDetailsProps = {
  stash?: string;
};

export function StashDetails({ stash }: StashDetailsProps) {
  const { value: info = [] } = useResolved(() => getStashInfo(stash), [stash]);

  return (
    <Section title="Stash Details" width="50%" height="100%">
      {stash && <Title text={stash} />}
      {info.map(
        ({ file, added, deleted, changeType }) =>
          changeType !== 'binary' && (
            <Box flexDirection="row" flexWrap="nowrap">
              <Text>{file}:&nbsp;</Text>
              <Text color="green">+{added ?? 0}&nbsp;</Text>
              <Text color="red">-{deleted ?? 0}</Text>
            </Box>
          )
      )}
    </Section>
  );
}

async function getStashInfo(ref?: string) {
  if (ref) {
    return await getLinesChanged(ref);
  }
}
