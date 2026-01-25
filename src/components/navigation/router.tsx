import { Text, useInput } from 'ink';
import { type SectionGroup, useNav } from './useNav';
import { Status } from '../../pages/status';
import { Log } from '../../pages/log';
import { Branches } from '../../pages/branches';
import { ErrorBoundary } from '../errorBoundry';
import { ErrorCatcherProvder } from '../hooks/useErrorCatcher';
import { Files } from '../../pages/files';
import { TreeNavigationProvder } from '../../pages/files/useTreeNavigation';
import { MessagingProvder } from '../hooks/useMessaging';

export function Router() {
  const { prevSection, nextSection, activeGroup, setActiveGroup } = useNav();

  useInput((input, key) => {
    if (key.tab && key.shift) {
      prevSection();
    } else if (key.tab) {
      nextSection();
    } else if (input === '1') {
      setActiveGroup('Files');
    } else if (input === '2') {
      setActiveGroup('Status');
    } else if (input === '3') {
      setActiveGroup('Log');
    } else if (input === '4') {
      setActiveGroup('Branches');
    }
  });

  return (
    <ErrorBoundary>
      <ErrorCatcherProvder>
        <MessagingProvder>
          <TreeNavigationProvder>
            <Nav group={activeGroup} />
          </TreeNavigationProvder>
        </MessagingProvder>
      </ErrorCatcherProvder>
    </ErrorBoundary>
  );
}

function Nav({ group }: { group: SectionGroup }) {
  switch (group) {
    case 'Files':
      return <Files />;
    case 'Status':
      return <Status />;
    case 'Log':
      return <Log />;
    case 'Branches':
      return <Branches />;
    default:
      return <Text>Error, unknown page "{group}"</Text>;
  }
}
