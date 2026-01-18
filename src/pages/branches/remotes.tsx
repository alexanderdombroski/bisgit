import { Text } from 'ink';
import { Section } from '../../components/section';
import { useResolved } from '../../components/hooks/useResolved';
import { getRemoteList } from '../../utils/git';
import { Fragment } from 'react';

export function Remotes() {
  const { value: remoteList } = useResolved(getRemoteList);

  return (
    <Section width="50%" title="Remotes">
      {remoteList?.map(({ url, name, type }) => (
        <Fragment key={`${name}-${type}`}>
          <Text wrap="truncate-end">
            {name} ({type})
          </Text>
          <Text wrap="truncate-end">{url}</Text>
          <Text> </Text>
        </Fragment>
      ))}
    </Section>
  );
}
