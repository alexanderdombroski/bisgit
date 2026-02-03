import { createContext, useContext, type PropsWithChildren } from 'react';
import { getStatusPorcelain } from '../../utils/git';

type StatusType = {};

const Status = createContext({} as StatusType);

export function StatusProvder({ children }: PropsWithChildren) {
  return <Status.Provider value={{}}>{children}</Status.Provider>;
}

export function useStatus(): StatusType {
  const context = useContext(Status);
  if (Object.keys(context).length === 0) {
    throw new Error('useStatus must be used within an StatusProvider');
  }
  return context;
}

// https://git-scm.com/docs/git-status#_short_format
type Status = 'M' | 'T' | 'A' | 'D' | 'R' | 'C' | 'U' | '?';

// eslint-disable-next-line
async function getStatus() {
  // eslint-disable-next-line
  const statusLines = await getStatusPorcelain();
}
