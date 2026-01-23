import { Text, useInput } from 'ink';
import { type SectionGroup, useNav } from './useNav';
import Status from '../../pages/status';
import { Log } from '../../pages/log';
import { Branches } from '../../pages/branches';
import { ErrorBoundary } from '../errorBoundry';
import { ErrorCatcherProvder } from '../hooks/useErrorCatcher';

export function Router() {
  const { prevSection, nextSection, activeGroup, setActiveGroup } = useNav();

  useInput((input, key) => {
    if (key.tab && key.shift) {
      prevSection();
    } else if (key.tab) {
      nextSection();
    } else if (input === '1') {
      setActiveGroup('Status');
    } else if (input === '2') {
      setActiveGroup('Log');
    } else if (input === '3') {
      setActiveGroup('Branches');
    }
  });

  return (
    <ErrorBoundary>
      <ErrorCatcherProvder>
        <Nav group={activeGroup} />
      </ErrorCatcherProvder>
    </ErrorBoundary>
  );
}

function Nav({ group }: { group: SectionGroup }) {
  switch (group) {
    case 'Status':
      return <Status />;
    case 'Log':
      return <Log />;
    case 'Branches':
      return <Branches />;
    default:
      return <Text>Error, unknown page {group}</Text>;
  }
}
