import { Text, useInput } from 'ink';
import { useNav } from './useNav';
import Status from '../../pages/status';
import Log from '../../pages/log';
import Branches from '../../pages/branches';

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

  switch (activeGroup) {
    case 'Status':
      return <Status />;
    case 'Log':
      return <Log />;
    case 'Branches':
      return <Branches />;
    default:
      return <Text>Error, unknown page {activeGroup}</Text>;
  }
}
